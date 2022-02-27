import { Prisma } from '@prisma/client';

import {
  getOriginForUser,
  getSessionUserId,
  getSlugFromReq,
  makeMethodsHandler,
} from 'lib-server/apiHelpers';
import { sendNotFound, sendOk } from 'lib-server/responses';
import prisma from 'prisma/client';
import { withApilytics } from 'utils/apilytics';
import { PERCENTILE_DATA_KEYS } from 'utils/constants';
import type { ApiHandler, EndpointData, OriginMetrics, TimeFrameData } from 'types';

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
  cpuUsageAvg: number;
  cpuUsageP50: number;
  cpuUsageP75: number;
  cpuUsageP90: number;
  cpuUsageP95: number;
  cpuUsageP99: number;
  memoryUsageAvg: number;
  memoryUsageP50: number;
  memoryUsageP75: number;
  memoryUsageP90: number;
  memoryUsageP95: number;
  memoryUsageP99: number;
  memoryTotalAvg: number;
  memoryTotalP50: number;
  memoryTotalP75: number;
  memoryTotalP90: number;
  memoryTotalP95: number;
  memoryTotalP99: number;
}

type RawEndpointData = Omit<EndpointData, 'methodAndEndpoint'>;

interface RawMiscData {
  browser: string | null;
  os: string | null;
  device: string | null;
  statusCode: number | null;
  requests: number;
}

const extractFromMiscData = <
  T extends RawMiscData,
  K extends Exclude<keyof RawMiscData, 'requests'>,
>(
  arr: T[],
  key: K,
): ({ [Key in K]: NonNullable<T[Key]> } & { requests: number })[] =>
  arr
    .filter(({ [key]: val }) => val !== null)
    .map(
      ({ [key]: val, requests }) =>
        // Assertion is needed because of computed property key type widening:
        // https://github.com/microsoft/TypeScript/issues/13948
        ({ [key]: val, requests } as { [Key in K]: NonNullable<T[Key]> } & { requests: number }),
    );

const handleGet: ApiHandler<GetResponse> = async (req, res) => {
  const userId = await getSessionUserId(req);
  const slug = getSlugFromReq(req);

  const { from, to, endpoint, method, statusCode, browser, os, device } = req.query as Record<
    string,
    string
  >;

  const origin = await getOriginForUser({ userId, slug });

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

  let wherePath: Prisma.Sql | undefined;
  if (endpoint) {
    const dynamicRoute = await prisma.dynamicRoute.findFirst({
      where: { originId, route: endpoint },
    });

    if (dynamicRoute) {
      wherePath = Prisma.sql`AND metrics.path LIKE ${dynamicRoute.pattern}`;
    } else {
      wherePath = Prisma.sql`AND metrics.path = ${endpoint}`;
    }
  } else {
    wherePath = Prisma.empty;
  }

  // The scope indicates which time unit the metrics are grouped by.
  let scope = 'day';

  if (timeFrame <= DAY_MILLIS) {
    scope = 'hour';
  } else if (timeFrame >= THREE_MONTHS_MILLIS) {
    scope = 'week';
  }

  const fromClause = Prisma.sql`
FROM metrics
  LEFT JOIN origins ON metrics.origin_id = origins.id`;

  const baseWhereClause = Prisma.sql`
WHERE origins.id = ${originId}
  ${wherePath}
  ${method ? Prisma.sql`AND metrics.method = ${method}` : Prisma.empty}
  ${statusCode ? Prisma.sql`AND metrics.status_code = ${Number(statusCode)}` : Prisma.empty}
  ${browser ? Prisma.sql`AND metrics.browser = ${browser}` : Prisma.empty}
  ${os ? Prisma.sql`AND metrics.os = ${os}` : Prisma.empty}
  ${device ? Prisma.sql`AND metrics.device = ${device}` : Prisma.empty}`;

  const whereClause = Prisma.sql`
${baseWhereClause}
  AND metrics.created_at >= ${fromDate}
  AND metrics.created_at <= ${toDate}`;

  const whereClausePreviousPeriod = Prisma.sql`
${baseWhereClause}
  AND metrics.created_at >= ${new Date(fromTime - (toTime - fromTime))}
  AND metrics.created_at <= ${fromDate}`;

  const prevGeneralDataPromise: Promise<RawGeneralData[]> = prisma.$queryRaw`
SELECT
  COUNT(*) AS "totalRequests",
  SUM(CASE WHEN CAST(metrics.status_code AS TEXT) ~ '^[45]' THEN 1 ELSE 0 END) AS "totalErrors"

${fromClause}
${whereClausePreviousPeriod}`;

  const generalDataPromise: Promise<RawGeneralData[]> = prisma.$queryRaw`
SELECT
  COUNT(*) AS "totalRequests",

  SUM(CASE WHEN CAST(metrics.status_code AS TEXT) ~ '^[45]' THEN 1 ELSE 0 END) AS "totalErrors",

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
  PERCENTILE_DISC(0.99) WITHIN GROUP (ORDER BY metrics.response_size) AS "responseSizeP99",

  ROUND(AVG(metrics.cpu_usage)) AS "cpuUsageAvg",
  PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY metrics.cpu_usage) AS "cpuUsageP50",
  PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY metrics.cpu_usage) AS "cpuUsageP75",
  PERCENTILE_DISC(0.9) WITHIN GROUP (ORDER BY metrics.cpu_usage) AS "cpuUsageP90",
  PERCENTILE_DISC(0.95) WITHIN GROUP (ORDER BY metrics.cpu_usage) AS "cpuUsageP95",
  PERCENTILE_DISC(0.99) WITHIN GROUP (ORDER BY metrics.cpu_usage) AS "cpuUsageP99",

  ROUND(AVG(metrics.memory_usage)) AS "memoryUsageAvg",
  PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY metrics.memory_usage) AS "memoryUsageP50",
  PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY metrics.memory_usage) AS "memoryUsageP75",
  PERCENTILE_DISC(0.9) WITHIN GROUP (ORDER BY metrics.memory_usage) AS "memoryUsageP90",
  PERCENTILE_DISC(0.95) WITHIN GROUP (ORDER BY metrics.memory_usage) AS "memoryUsageP95",
  PERCENTILE_DISC(0.99) WITHIN GROUP (ORDER BY metrics.memory_usage) AS "memoryUsageP99",

  ROUND(AVG(metrics.memory_total)) AS "memoryTotalAvg",
  PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY metrics.memory_total) AS "memoryTotalP50",
  PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY metrics.memory_total) AS "memoryTotalP75",
  PERCENTILE_DISC(0.9) WITHIN GROUP (ORDER BY metrics.memory_total) AS "memoryTotalP90",
  PERCENTILE_DISC(0.95) WITHIN GROUP (ORDER BY metrics.memory_total) AS "memoryTotalP95",
  PERCENTILE_DISC(0.99) WITHIN GROUP (ORDER BY metrics.memory_total) AS "memoryTotalP99"

${fromClause}
${whereClause}`;

  const timeFrameDataPromise: Promise<TimeFrameData[]> = prisma.$queryRaw`
SELECT
  COUNT(*) AS requests,
  DATE_TRUNC(${scope}, metrics.created_at) AS time,
  SUM(CASE WHEN CAST(metrics.status_code AS TEXT) ~ '^[45]' THEN 1 ELSE 0 END) AS errors

${fromClause}
${whereClause}

GROUP BY time;`;

  // If an endpoint is provided as a filter, return all paths matching that endpoint.
  // Otherwise, return all dynamic routes + other paths through `endpoint`.
  let endpointSelectClause: Prisma.Sql | undefined;

  if (endpoint) {
    endpointSelectClause = Prisma.sql`metrics.path AS endpoint`;
  } else {
    endpointSelectClause = Prisma.sql`
CASE
  WHEN matched_routes.route IS NULL
  THEN metrics.path
  ELSE matched_routes.route END AS endpoint`;
  }

  const endpointDataPromise: Promise<RawEndpointData[]> = prisma.$queryRaw`
SELECT
  COUNT(*) AS "totalRequests",
  metrics.method,
  ROUND(AVG(metrics.time_millis)) AS "responseTimeAvg",
  ${endpointSelectClause}

${fromClause}

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

${whereClause}

GROUP BY metrics.method, endpoint;`;
  const miscDataPromise: Promise<RawMiscData[]> = prisma.$queryRaw`
SELECT
  metrics.browser,
  metrics.os,
  metrics.device,
  metrics.status_code as "statusCode",
  COUNT(*) AS requests

${fromClause}
${whereClause}

GROUP BY GROUPING SETS (
  metrics.browser,
  metrics.os,
  metrics.device,
  metrics.status_code
);`;

  const versionDataPromise = prisma.metric.findFirst({
    where: { originId },
    orderBy: { createdAt: 'desc' },
    select: { apilyticsVersion: true },
  });

  const [prevGeneralData, _generalData, timeFrameData, _endpointData, miscData, versionData] =
    await Promise.all([
      prevGeneralDataPromise,
      generalDataPromise,
      timeFrameDataPromise,
      endpointDataPromise,
      miscDataPromise,
      versionDataPromise,
    ]);

  const { totalRequests: prevTotalRequests, totalErrors: prevTotalErrors } = prevGeneralData[0];
  const { totalRequests, totalErrors, ...g } = _generalData[0];

  const totalRequestsGrowth = Number((totalRequests / prevTotalRequests).toFixed(2));
  const totalErrorsGrowth = Number((totalErrors / prevTotalErrors).toFixed(2));

  const prevErrorRate = Number((prevTotalErrors / prevTotalRequests).toFixed(2));
  const errorRate = Number((totalErrors / totalRequests).toFixed(2));
  const errorRateGrowth = Number((errorRate / prevErrorRate).toFixed(2));

  const endpointData = _endpointData.map((endpoint) => ({
    ...endpoint,
    methodAndEndpoint: `${endpoint.method} ${endpoint.endpoint}`,
  }));

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

  const cpuUsage = {
    avg: g.cpuUsageAvg,
    p50: g.cpuUsageP50,
    p75: g.cpuUsageP75,
    p90: g.cpuUsageP90,
    p95: g.cpuUsageP95,
    p99: g.cpuUsageP99,
  };

  const memoryUsage = {
    avg: g.memoryUsageAvg,
    p50: g.memoryUsageP50,
    p75: g.memoryUsageP75,
    p90: g.memoryUsageP90,
    p95: g.memoryUsageP95,
    p99: g.memoryUsageP99,
  };

  const totalMemory = {
    avg: g.memoryTotalAvg,
    p50: g.memoryTotalP50,
    p75: g.memoryTotalP75,
    p90: g.memoryTotalP90,
    p95: g.memoryTotalP95,
    p99: g.memoryTotalP99,
  };

  const percentileData = PERCENTILE_DATA_KEYS.map((key) => ({
    key,
    responseTime: responseTimes[key],
    requestSize: requestSizes[key],
    responseSize: responseSizes[key],
    cpuUsage: cpuUsage[key],
    memoryUsage: memoryUsage[key],
    memoryTotal: totalMemory[key],
  }));

  const userAgentData = {
    browserData: extractFromMiscData(miscData, 'browser'),
    osData: extractFromMiscData(miscData, 'os'),
    deviceData: extractFromMiscData(miscData, 'device'),
  };

  const [identifier, version] = versionData?.apilyticsVersion?.split(';')[0].split('/') ?? [];
  const apilyticsPackage =
    !!identifier && !!version
      ? {
          identifier,
          version,
        }
      : undefined;

  const data = {
    generalData,
    timeFrameData,
    endpointData,
    percentileData,
    statusCodeData: extractFromMiscData(miscData, 'statusCode'),
    userAgentData,
    apilyticsPackage,
  };

  sendOk(res, { data });
};

const handler = makeMethodsHandler({ GET: handleGet }, true);

export default withApilytics(handler);
