import { getSessionUserId, getSlugFromReq, makeMethodsHandler } from 'lib-server/apiHelpers';
import { withAuthRequired } from 'lib-server/middleware';
import { sendNotFound, sendOk } from 'lib-server/responses';
import prisma from 'prisma/client';
import { withApilytics } from 'utils/apilytics';
import { PERCENTILE_DATA_KEYS } from 'utils/constants';
import type { ApiHandler, EndpointData, OriginMetrics, StatusCodeData, TimeFrameData } from 'types';

const DAY_MILLIS = 24 * 60 * 60 * 1000;
const THREE_MONTHS_MILLIS = 3 * 30 * DAY_MILLIS;

interface GetResponse {
  data: OriginMetrics;
}

interface GeneralData {
  totalRequests: number;
  totalRequestsGrowth: number;
  totalErrors: number;
  totalErrorsGrowth: number;
}

interface RawGeneralData extends GeneralData {
  responseTimeAvg: number;
  responseTimeP50: number;
  responseTimeP75: number;
  responseTimeP90: number;
  responseTimeP95: number;
  responseTimeP99: number;
  requestSizeAvg: number;
  requestSizeP50: number;
  requestSizeP75: number;
  requestSizeP90: number;
  requestSizeP95: number;
  requestSizeP99: number;
  responseSizeAvg: number;
  responseSizeP50: number;
  responseSizeP75: number;
  responseSizeP90: number;
  responseSizeP95: number;
  responseSizeP99: number;
}

const handleGet: ApiHandler<GetResponse> = async (req, res) => {
  const userId = await getSessionUserId(req);
  const slug = getSlugFromReq(req);

  const {
    from,
    to,
    method: _method,
    endpoint: _endpoint,
    statusCode: _statusCode,
  } = req.query as Record<string, string>;

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
  const statusCode = decodeURIComponent(_statusCode) || '%';

  // Check if the provided endpoint is a dynamic route.
  if (endpoint) {
    const dynamicRoute = await prisma.dynamicRoute.findFirst({
      where: { originId, route: endpoint },
    });

    if (dynamicRoute) {
      endpoint = dynamicRoute.pattern;
    } else {
      endpoint = '%';
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

  const prevGeneralDataPromise: Promise<RawGeneralData[]> = prisma.$queryRaw`
SELECT
  COUNT(metrics) AS "totalRequests",

  SUM(CASE WHEN CAST(metrics.status_code AS TEXT) LIKE '4%_'
    OR CAST(metrics.status_code AS TEXT) LIKE '5%_'
      THEN 1 ELSE 0 END) AS "totalErrors"

FROM metrics
  LEFT JOIN origins ON metrics.origin_id = origins.id

WHERE origins.id = ${originId}
  AND origins.user_id = ${userId}
  AND metrics.created_at >= ${new Date(fromTime - (toTime - fromTime))}
  AND metrics.created_at <= ${fromDate}
  AND metrics.method LIKE ${method}
  AND metrics.path LIKE ${endpoint}
  AND CAST(metrics.status_code AS TEXT) LIKE ${statusCode};`;

  const generalDataPromise: Promise<RawGeneralData[]> = prisma.$queryRaw`
SELECT
  COUNT(metrics) AS "totalRequests",

  SUM(CASE WHEN CAST(metrics.status_code AS TEXT) LIKE '4%_'
    OR CAST(metrics.status_code AS TEXT) LIKE '5%_'
      THEN 1 ELSE 0 END) AS "totalErrors",

  ROUND(AVG(metrics.time_millis)) AS "responseTimeAvg",
  PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY metrics.time_millis) AS "responseTimeP50",
  PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY metrics.time_millis) AS "responseTimeP75",
  PERCENTILE_DISC(0.9) WITHIN GROUP (ORDER BY metrics.time_millis) AS "responseTimeP90",
  PERCENTILE_DISC(0.95) WITHIN GROUP (ORDER BY metrics.time_millis) AS "responseTimeP95",
  PERCENTILE_DISC(0.99) WITHIN GROUP (ORDER BY metrics.time_millis) AS "responseTimeP99",

  ROUND(AVG(metrics.request_size)) AS "requestSizeAvg",
  PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY metrics.request_size) AS "requestSizeP50",
  PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY metrics.request_size) AS "requestSizeP75",
  PERCENTILE_DISC(0.9) WITHIN GROUP (ORDER BY metrics.request_size) AS "requestSizeP90",
  PERCENTILE_DISC(0.95) WITHIN GROUP (ORDER BY metrics.request_size) AS "requestSizeP95",
  PERCENTILE_DISC(0.99) WITHIN GROUP (ORDER BY metrics.request_size) AS "requestSizeP99",

  ROUND(AVG(metrics.response_size)) AS "responseSizeAvg",
  PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY metrics.response_size) AS "responseSizeP50",
  PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY metrics.response_size) AS "responseSizeP75",
  PERCENTILE_DISC(0.9) WITHIN GROUP (ORDER BY metrics.response_size) AS "responseSizeP90",
  PERCENTILE_DISC(0.95) WITHIN GROUP (ORDER BY metrics.response_size) AS "responseSizeP95",
  PERCENTILE_DISC(0.99) WITHIN GROUP (ORDER BY metrics.response_size) AS "responseSizeP99"

FROM metrics
  LEFT JOIN origins ON metrics.origin_id = origins.id

WHERE origins.id = ${originId}
  AND origins.user_id = ${userId}
  AND metrics.created_at >= ${fromDate}
  AND metrics.created_at <= ${toDate}
  AND metrics.method LIKE ${method}
  AND metrics.path LIKE ${endpoint}
  AND CAST(metrics.status_code AS TEXT) LIKE ${statusCode};`;

  const timeFrameDataPromise: Promise<TimeFrameData[]> = prisma.$queryRaw`
SELECT
  COUNT(*) AS requests,
  DATE_TRUNC(${scope}, metrics.created_at) AS time,

  SUM(CASE WHEN CAST(metrics.status_code AS TEXT) LIKE '4%_'
    OR CAST(metrics.status_code AS TEXT) LIKE '5%_'
      THEN 1 ELSE 0 END) AS errors

FROM metrics
  LEFT JOIN origins ON metrics.origin_id = origins.id

WHERE origins.id = ${originId}
  AND origins.user_id = ${userId}
  AND metrics.created_at >= ${fromDate}
  AND metrics.created_at <= ${toDate}
  AND metrics.method LIKE ${method}
  AND metrics.path LIKE ${endpoint}
  AND CAST(metrics.status_code AS TEXT) LIKE ${statusCode}

GROUP BY time;`;

  const endpointDataPromise: Promise<EndpointData[]> = prisma.$queryRaw`
SELECT
  COUNT(*) AS "totalRequests",
  metrics.method,
  CONCAT(metrics.method, ' ', metrics.path) AS "methodAndEndpoint",
  ROUND(AVG(metrics.time_millis)) AS "responseTimeAvg",

  CASE
    WHEN matched_routes.route IS NULL
    THEN metrics.path
    ELSE matched_routes.route END AS endpoint

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
  AND CAST(metrics.status_code AS TEXT) LIKE ${statusCode}

GROUP BY metrics.method, metrics.path, endpoint;`;

  const statusCodeDataPromise: Promise<StatusCodeData[]> = prisma.$queryRaw`
SELECT
  metrics.status_code as "statusCode",
  COUNT(*)
FROM metrics
  LEFT JOIN origins ON metrics.origin_id = origins.id
WHERE origins.id = ${originId}
  AND origins.user_id = ${userId}
  AND metrics.created_at >= ${fromDate}
  AND metrics.created_at <= ${toDate}
  AND metrics.method LIKE ${method}
  AND metrics.path LIKE ${endpoint}
  AND CAST(metrics.status_code AS TEXT) LIKE ${statusCode}
GROUP BY metrics.status_code;`;

  const [prevGeneralData, _generalData, timeFrameData, endpointData, statusCodeData] =
    await Promise.all([
      prevGeneralDataPromise,
      generalDataPromise,
      timeFrameDataPromise,
      endpointDataPromise,
      statusCodeDataPromise,
    ]);

  const { totalRequests: prevTotalRequests, totalErrors: prevTotalErrors } = prevGeneralData[0];
  const { totalRequests, totalErrors, ...g } = _generalData[0];

  const totalRequestsGrowth = Number((totalRequests / prevTotalRequests).toFixed(2));
  const totalErrorsGrowth = Number((totalErrors / prevTotalErrors).toFixed(2));

  const prevErrorRate = Number((prevTotalErrors / prevTotalRequests).toFixed(2));
  const errorRate = Number((totalErrors / totalRequests).toFixed(2));
  const errorRateGrowth = Number((errorRate / prevErrorRate).toFixed(2));

  const generalData = {
    totalRequests,
    totalRequestsGrowth,
    totalErrors,
    totalErrorsGrowth,
    errorRate,
    errorRateGrowth,
  };

  const responseTimes = {
    avg: g.responseTimeAvg,
    p50: g.responseTimeP50,
    p75: g.responseTimeP75,
    p90: g.responseTimeP90,
    p95: g.responseTimeP95,
    p99: g.responseTimeP99,
  };

  const requestSizes = {
    avg: g.requestSizeAvg,
    p50: g.requestSizeP50,
    p75: g.requestSizeP75,
    p90: g.requestSizeP90,
    p95: g.requestSizeP95,
    p99: g.requestSizeP99,
  };

  const responseSizes = {
    avg: g.responseSizeAvg,
    p50: g.responseSizeP50,
    p75: g.responseSizeP75,
    p90: g.responseSizeP90,
    p95: g.responseSizeP95,
    p99: g.responseSizeP99,
  };

  const percentileData = PERCENTILE_DATA_KEYS.map((key) => ({
    key,
    responseTime: responseTimes[key as keyof typeof responseTimes],
    requestSize: requestSizes[key as keyof typeof requestSizes],
    responseSize: responseSizes[key as keyof typeof responseSizes],
  }));

  const data = {
    generalData,
    timeFrameData,
    endpointData,
    percentileData,
    statusCodeData,
  };

  sendOk(res, { data });
};

const handler = withAuthRequired(makeMethodsHandler({ GET: handleGet }));

export default withApilytics(handler);
