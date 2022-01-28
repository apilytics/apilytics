import type { PrismaPromise } from '@prisma/client';

import { getSessionUserId, getSlugFromReq, makeMethodsHandler } from 'lib-server/apiHelpers';
import { withAuthRequired } from 'lib-server/middleware';
import { sendNotFound, sendOk } from 'lib-server/responses';
import prisma from 'prisma/client';
import { withApilytics } from 'utils/apilytics';
import type { ApiHandler, EndpointData, OriginMetrics, TimeFrameData } from 'types';

const DAY_MILLIS = 24 * 60 * 60 * 1000;
const THREE_MONTHS_MILLIS = 3 * 30 * DAY_MILLIS;

interface GetResponse {
  data: OriginMetrics;
}

const handleGet: ApiHandler<GetResponse> = async (req, res) => {
  const userId = await getSessionUserId(req);
  const slug = getSlugFromReq(req);
  const { from, to } = req.query;

  if (typeof from !== 'string' || typeof to !== 'string') {
    throw new Error('Invalid time frame specified.');
  }

  const origin = await prisma.origin.findFirst({
    where: { slug, userId },
  });

  if (!origin) {
    sendNotFound(res, 'Origin');
    return;
  }

  const { id: originId } = origin;
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const fromTime = fromDate.getTime();
  const toTime = toDate.getTime();
  const timeFrame = toTime - fromTime;

  // The scope indicates which time unit the metrics are grouped by.
  let scope = 'day';

  if (timeFrame <= DAY_MILLIS) {
    scope = 'hour';
  } else if (timeFrame >= THREE_MONTHS_MILLIS) {
    scope = 'week';
  }

  const getGeneralDataPromise = ({
    fromDate,
    toDate,
  }: {
    fromDate: Date;
    toDate: Date;
  }): PrismaPromise<{ total_requests: number; total_errors: number }[]> => {
    return prisma.$queryRaw`
SELECT
  COUNT(*) AS total_requests,
  SUM(CASE WHEN CAST(metrics.status_code AS TEXT) LIKE '4%_'
    OR CAST(metrics.status_code AS TEXT) LIKE '5%_'
      THEN 1 ELSE 0 END) AS total_errors
FROM metrics
  LEFT JOIN origins ON metrics.origin_id = origins.id
WHERE origins.id = ${originId}
  AND origins.user_id = ${userId}
  AND metrics.created_at >= ${fromDate}
  AND metrics.created_at <= ${toDate}`;
  };

  const generalDataPromise = getGeneralDataPromise({ fromDate, toDate });

  const previousGeneralDataPromise = getGeneralDataPromise({
    fromDate: new Date(fromTime - (toTime - fromTime)),
    toDate: fromDate,
  });

  const timeFrameDataPromise: Promise<TimeFrameData[]> = prisma.$queryRaw`
SELECT
  COUNT(*) AS requests,
  SUM(CASE WHEN CAST(metrics.status_code AS TEXT) LIKE '4%_'
    OR CAST(metrics.status_code AS TEXT) LIKE '5%_'
      THEN 1 ELSE 0 END) AS errors,
  DATE_TRUNC(${scope}, metrics.created_at) AS time
FROM metrics
  LEFT JOIN origins ON metrics.origin_id = origins.id
WHERE origins.id = ${originId}
  AND origins.user_id = ${userId}
  AND metrics.created_at >= ${fromDate}
  AND metrics.created_at <= ${toDate}
GROUP BY time;`;

  const endpointDataPromise: Promise<EndpointData[]> = prisma.$queryRaw`
SELECT
  COUNT(*) AS requests,
  CASE WHEN matched_routes.route IS NULL THEN metrics.path ELSE matched_routes.route END AS endpoint,
  metrics.method,
  ARRAY_AGG(DISTINCT(metrics.status_code)) AS status_codes,

  ROUND(AVG(metrics.time_millis)) AS avg_response_time,
  PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY metrics.time_millis) AS response_time_p50,
  PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY metrics.time_millis) AS response_time_p75,
  PERCENTILE_DISC(0.9) WITHIN GROUP (ORDER BY metrics.time_millis) AS response_time_p90,
  PERCENTILE_DISC(0.95) WITHIN GROUP (ORDER BY metrics.time_millis) AS response_time_p95,
  PERCENTILE_DISC(0.99) WITHIN GROUP (ORDER BY metrics.time_millis) AS response_time_p99,

  ROUND(AVG(metrics.request_size)) AS avg_request_size,
  PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY metrics.request_size) AS request_size_p50,
  PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY metrics.request_size) AS request_size_p75,
  PERCENTILE_DISC(0.9) WITHIN GROUP (ORDER BY metrics.request_size) AS request_size_p90,
  PERCENTILE_DISC(0.95) WITHIN GROUP (ORDER BY metrics.request_size) AS request_size_p95,
  PERCENTILE_DISC(0.99) WITHIN GROUP (ORDER BY metrics.request_size) AS request_size_p99,

  ROUND(AVG(metrics.response_size)) AS avg_response_size,
  PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY metrics.response_size) AS response_size_p50,
  PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY metrics.response_size) AS response_size_p75,
  PERCENTILE_DISC(0.9) WITHIN GROUP (ORDER BY metrics.response_size) AS response_size_p90,
  PERCENTILE_DISC(0.95) WITHIN GROUP (ORDER BY metrics.response_size) AS response_size_p95,
  PERCENTILE_DISC(0.99) WITHIN GROUP (ORDER BY metrics.response_size) AS response_size_p99
FROM metrics
  LEFT JOIN origins ON metrics.origin_id = origins.id
  LEFT JOIN LATERAL (
    SELECT dynamic_routes.route
    FROM dynamic_routes
    WHERE dynamic_routes.origin_id = ${originId}
      AND metrics.path LIKE dynamic_routes.pattern
      AND LENGTH(metrics.path) - LENGTH(REPLACE(metrics.path, '/', ''))
        = LENGTH(dynamic_routes.pattern) - LENGTH(REPLACE(dynamic_routes.pattern, '/', ''))
    ORDER BY LENGTH(dynamic_routes.pattern) DESC
    LIMIT 1
  ) AS matched_routes ON TRUE
WHERE origins.id = ${originId}
  AND origins.user_id = ${userId}
  AND metrics.created_at >= ${fromDate}
  AND metrics.created_at <= ${toDate}
GROUP BY metrics.method, endpoint;`;

  const [generalData, previousGeneralData, timeFrameData, endpointData] = await Promise.all([
    generalDataPromise,
    previousGeneralDataPromise,
    timeFrameDataPromise,
    endpointDataPromise,
  ]);

  const { total_requests: totalRequests, total_errors: totalErrors } = generalData[0];
  const { total_requests: previousTotalRequests, total_errors: previousTotalErrors } =
    previousGeneralData[0];

  const totalRequestsGrowth = Number((totalRequests / previousTotalRequests).toFixed(2));
  const totalErrorsGrowth = Number((totalErrors / previousTotalErrors).toFixed(2));

  const data = {
    totalRequests,
    totalRequestsGrowth,
    totalErrors,
    totalErrorsGrowth,
    timeFrameData,
    endpointData,
  };

  sendOk(res, { data });
};

const handler = withAuthRequired(makeMethodsHandler({ GET: handleGet }));

export default withApilytics(handler);
