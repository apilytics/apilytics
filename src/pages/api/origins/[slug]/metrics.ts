import { getSessionUserId, getSlugFromReq, makeMethodsHandler } from 'lib-server/apiHelpers';
import { withAuthRequired } from 'lib-server/middleware';
import { sendNotFound, sendOk } from 'lib-server/responses';
import prisma from 'prisma/client';
import { withApilytics } from 'utils/apilytics';
import type { ApiHandler, EndpointData, OriginMetrics, StatusCodeData, TimeFrameData } from 'types';

const DAY_MILLIS = 24 * 60 * 60 * 1000;
const THREE_MONTHS_MILLIS = 3 * 30 * DAY_MILLIS;

interface GetResponse {
  data: OriginMetrics;
}

interface GeneralData {
  totalRequests: number;
  totalErrors: number;
}

interface RawEndpointData extends Pick<EndpointData, 'totalRequests' | 'endpoint' | 'method'> {
  response_time_avg: number;
  response_time_p50: number;
  response_time_p75: number;
  response_time_p90: number;
  response_time_p95: number;
  response_time_p99: number;
  request_size_avg: number;
  request_size_p50: number;
  request_size_p75: number;
  request_size_p90: number;
  request_size_p95: number;
  request_size_p99: number;
  response_size_avg: number;
  response_size_p50: number;
  response_size_p75: number;
  response_size_p90: number;
  response_size_p95: number;
  response_size_p99: number;
}

const handleGet: ApiHandler<GetResponse> = async (req, res) => {
  const userId = await getSessionUserId(req);
  const slug = getSlugFromReq(req);
  const { from, to, method: _method, endpoint: _endpoint } = req.query as Record<string, string>;

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
  const method = decodeURIComponent(_method) || '%';
  let endpoint = decodeURIComponent(_endpoint);

  // Check if the provided endpoint is a dynamic route.
  if (endpoint) {
    const dynamicRoute = await prisma.dynamicRoute.findFirst({
      where: { originId, route: endpoint },
    });

    if (dynamicRoute) {
      endpoint = dynamicRoute.pattern;
    }
  } else {
    endpoint = '%';
  }

  // The scope indicates which time unit the metrics are grouped by.
  let scope = 'day';

  if (timeFrame <= DAY_MILLIS) {
    scope = 'hour';
  } else if (timeFrame >= THREE_MONTHS_MILLIS) {
    scope = 'week';
  }

  const generalDataPromise: Promise<GeneralData[]> = prisma.$queryRaw`
SELECT
  COUNT(*) AS "totalRequests",
  SUM(CASE WHEN CAST(metrics.status_code AS TEXT) LIKE '4%_'
  OR CAST(metrics.status_code AS TEXT) LIKE '5%_'
    THEN 1 ELSE 0 END) AS "totalErrors"
FROM metrics
  LEFT JOIN origins ON metrics.origin_id = origins.id
WHERE origins.id = ${originId}
  AND origins.user_id = ${userId}
  AND metrics.created_at >= ${from}
  AND metrics.created_at <= ${to}
  AND metrics.method LIKE ${method}
  AND metrics.path LIKE ${endpoint}`;

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
  AND metrics.method LIKE ${method}
  AND metrics.path LIKE ${endpoint}
GROUP BY time;`;

  const endpointDataPromise: Promise<RawEndpointData[]> = prisma.$queryRaw`
SELECT
  COUNT(*) AS "totalRequests",
  CASE WHEN matched_routes.route IS NULL THEN metrics.path ELSE matched_routes.route END AS endpoint,
  metrics.method,

  ROUND(AVG(metrics.time_millis)) AS response_time_avg,
  PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY metrics.time_millis) AS response_time_p50,
  PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY metrics.time_millis) AS response_time_p75,
  PERCENTILE_DISC(0.9) WITHIN GROUP (ORDER BY metrics.time_millis) AS response_time_p90,
  PERCENTILE_DISC(0.95) WITHIN GROUP (ORDER BY metrics.time_millis) AS response_time_p95,
  PERCENTILE_DISC(0.99) WITHIN GROUP (ORDER BY metrics.time_millis) AS response_time_p99,

  ROUND(AVG(metrics.request_size)) AS request_size_avg,
  PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY metrics.request_size) AS request_size_p50,
  PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY metrics.request_size) AS request_size_p75,
  PERCENTILE_DISC(0.9) WITHIN GROUP (ORDER BY metrics.request_size) AS request_size_p90,
  PERCENTILE_DISC(0.95) WITHIN GROUP (ORDER BY metrics.request_size) AS request_size_p95,
  PERCENTILE_DISC(0.99) WITHIN GROUP (ORDER BY metrics.request_size) AS request_size_p99,

  ROUND(AVG(metrics.response_size)) AS response_size_avg,
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
  AND metrics.method LIKE ${method}
  AND metrics.path LIKE ${endpoint}
GROUP BY metrics.method, endpoint;`;

  const statusCodeDataPromise: Promise<StatusCodeData[]> = prisma.$queryRaw`
SELECT
  metrics.status_code,
  COUNT(*)
FROM metrics
  LEFT JOIN origins ON metrics.origin_id = origins.id
WHERE origins.id = ${originId}
  AND origins.user_id = ${userId}
  AND metrics.created_at >= ${fromDate}
  AND metrics.created_at <= ${toDate}
  AND metrics.method LIKE ${method}
  AND metrics.path LIKE ${endpoint}
GROUP BY metrics.status_code;`;

  const [generalData, timeFrameData, _endpointData, statusCodeData] = await Promise.all([
    generalDataPromise,
    timeFrameDataPromise,
    endpointDataPromise,
    statusCodeDataPromise,
  ]);

  const { totalRequests, totalErrors } = generalData[0];

  const endpointData: EndpointData[] = _endpointData.map(
    ({ totalRequests, endpoint, method, ...data }) => ({
      totalRequests,
      endpoint,
      method,
      methodAndEndpoint: `${method} ${endpoint}`,
      responseTimes: {
        avg: data.response_time_avg,
        p50: data.response_time_p50,
        p75: data.response_time_p75,
        p90: data.response_time_p90,
        p95: data.response_time_p95,
        p99: data.response_time_p99,
      },
      requestSizes: {
        avg: data.request_size_avg,
        p50: data.request_size_p50,
        p75: data.request_size_p75,
        p90: data.request_size_p90,
        p95: data.request_size_p95,
        p99: data.request_size_p99,
      },
      responseSizes: {
        avg: data.response_size_avg,
        p50: data.response_size_p50,
        p75: data.response_size_p75,
        p90: data.response_size_p90,
        p95: data.response_size_p95,
        p99: data.response_size_p99,
      },
    }),
  );

  const data = {
    totalRequests,
    totalErrors,
    timeFrameData,
    endpointData,
    statusCodeData,
  };

  sendOk(res, { data });
};

const handler = withAuthRequired(makeMethodsHandler({ GET: handleGet }));

export default withApilytics(handler);
