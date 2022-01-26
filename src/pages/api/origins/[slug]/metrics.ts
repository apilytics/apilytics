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

  const timeFrameDataPromise: Promise<TimeFrameData[]> = prisma.$queryRaw`
SELECT
  COUNT(*) AS requests,
  DATE_TRUNC(${scope}, metrics.created_at) AS time
FROM metrics
  LEFT JOIN origins ON metrics.origin_id = origins.id
WHERE origins.id = ${originId}
  AND origins.user_id = ${userId}
  AND metrics.created_at >= ${fromDate}
  AND metrics.created_at <= ${toDate}
GROUP BY time;`;

  // Get number of requests during the last specified time frame.
  const lastTotalRequestsPromise = prisma.metric.count({
    where: {
      origin: {
        userId,
      },
      originId,
      createdAt: {
        gte: new Date(fromTime - (toTime - fromTime)),
        lte: fromDate,
      },
    },
  });

  const totalRequestsPromise = prisma.metric.count({
    where: {
      origin: {
        userId,
      },
      originId,
      createdAt: {
        gte: fromDate,
        lte: toDate,
      },
    },
  });

  const endpointDataPromise: Promise<EndpointData[]> = prisma.$queryRaw`
SELECT
  COUNT(*) AS requests,
  CASE WHEN matched_routes.route IS NULL THEN metrics.path ELSE matched_routes.route END AS endpoint,
  metrics.method,
  ARRAY_AGG(DISTINCT(metrics.status_code)) AS status_codes,
  ROUND(AVG(metrics.time_millis)) AS avg_response_time,
  PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY metrics.time_millis) AS p50,
  PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY metrics.time_millis) AS p75,
  PERCENTILE_DISC(0.9) WITHIN GROUP (ORDER BY metrics.time_millis) AS p90,
  PERCENTILE_DISC(0.95) WITHIN GROUP (ORDER BY metrics.time_millis) AS p95,
  PERCENTILE_DISC(0.99) WITHIN GROUP (ORDER BY metrics.time_millis) AS p99
FROM metrics
  LEFT JOIN origins ON metrics.origin_id = origins.id
  LEFT JOIN LATERAL (
    SELECT origin_routes.route
    FROM origin_routes
    WHERE origin_routes.origin_id = ${originId}
      AND metrics.path ~ origin_routes.pattern
    ORDER BY LENGTH(origin_routes.pattern) DESC
    LIMIT 1
  ) AS matched_routes ON TRUE
WHERE origins.id = ${originId}
  AND origins.user_id = ${userId}
  AND metrics.created_at >= ${fromDate}
  AND metrics.created_at <= ${toDate}
GROUP BY metrics.method, endpoint;`;

  const [timeFrameData, lastTotalRequests, totalRequests, endpointData] = await Promise.all([
    timeFrameDataPromise,
    lastTotalRequestsPromise,
    totalRequestsPromise,
    endpointDataPromise,
  ]);

  const totalRequestsGrowth = Number((totalRequests / lastTotalRequests).toFixed(2));

  const data = {
    totalRequests,
    totalRequestsGrowth,
    timeFrameData,
    endpointData,
  };

  sendOk(res, { data });
};

const handler = withAuthRequired(makeMethodsHandler({ GET: handleGet }));

export default withApilytics(handler);
