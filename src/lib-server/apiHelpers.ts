import { Prisma } from '@prisma/client';
import { getSession } from 'next-auth/react';
import nodemailer from 'nodemailer';
import type { Origin } from '@prisma/client';
import type { NextApiRequest } from 'next';
import type { EmailConfig } from 'next-auth/providers';

import { sendMethodNotAllowed, sendUnauthorized, sendUnknownError } from 'lib-server/responses';
import prisma from 'prisma/client';
import { AWS_SES } from 'ses';
import { METHODS, ORIGIN_ROLES, PERCENTILE_DATA_KEYS, SAFE_METHODS } from 'utils/constants';
import { FRONTEND_URL, staticRoutes } from 'utils/router';
import type {
  ApiHandler,
  CityData,
  CountryData,
  EndpointData,
  Method,
  OriginData,
  OriginMetrics,
  RegionData,
  TimeFrameData,
} from 'types';

class UnauthorizedApiError extends Error {}

const isMethod = (x: unknown): x is Method => {
  return METHODS.includes(x as Method);
};

type Handlers = {
  [key in Method]?: ApiHandler;
};

export const makeMethodsHandler =
  (handlers: Handlers, authRequired: boolean): ApiHandler =>
  async (req, res): Promise<void> => {
    const { method } = req;
    if (isMethod(method)) {
      if (authRequired) {
        const { userId, isAdmin } = (await getSession({ req })) ?? {};

        if (!userId) {
          sendUnauthorized(res);
          return;
        }

        if (isAdmin && !SAFE_METHODS.includes(method)) {
          sendUnauthorized(res, 'Only safe methods allowed for admin users.');
          return;
        }
      }

      const handler = handlers[method];

      if (handler) {
        try {
          await handler(req, res);
        } catch (e) {
          if (e instanceof UnauthorizedApiError) {
            sendUnauthorized(res);
            return;
          }

          // Next.js's default 500 response is HTML based, but JSON is more easily comprehensible by our frontend.
          // This is only meant to be the last resort, and catches any completely unexpected errors.
          sendUnknownError(res);
          console.error(e);
        }
        return;
      }
    }
    sendMethodNotAllowed(res, Object.keys(handlers));
  };

export const getSlugFromReq = (req: NextApiRequest): string => {
  const { slug } = req.query;

  if (typeof slug === 'string') {
    return slug;
  }

  throw new Error(`Invalid slug param in route: ${slug}`);
};

export const getIdFromReq = (req: NextApiRequest): string => {
  const { id } = req.query;

  if (typeof id === 'string') {
    return id;
  }

  throw new Error(`Invalid ıd param in route: ${id}`);
};

export const getSessionUserId = async (req: NextApiRequest): Promise<string> => {
  const { userId } = (await getSession({ req })) ?? {};

  if (!userId) {
    throw new UnauthorizedApiError();
  }

  return userId;
};

export const getOriginForUser = async ({
  userId,
  slug,
}: {
  userId: string;
  slug?: string;
}): Promise<OriginData | null> => {
  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: { isAdmin: true },
  });

  const where = user?.isAdmin ? { slug } : { originUsers: { some: { userId } }, slug };

  const origin = await prisma.origin.findFirst({
    where,
    include: {
      originUsers: { select: { userId: true, role: true } },
      dynamicRoutes: { select: { id: true } },
      excludedRoutes: { select: { id: true } },
    },
  });

  if (origin) {
    const {
      id,
      name,
      slug,
      apiKey,
      createdAt,
      updatedAt,
      dynamicRoutes,
      excludedRoutes,
      weeklyEmailReportsEnabled,
      lastAutomaticWeeklyEmailReportsSentAt,
    } = origin;

    return {
      id,
      name,
      slug,
      apiKey,
      createdAt,
      updatedAt,
      userRole: origin.originUsers.find((user) => user.userId === userId)?.role as ORIGIN_ROLES,
      userCount: origin.originUsers.length,
      dynamicRouteCount: dynamicRoutes.length,
      excludedRouteCount: excludedRoutes.length,
      weeklyEmailReportsEnabled,
      lastAutomaticWeeklyEmailReportsSentAt,
    };
  }

  return null;
};

const getOriginInviteEmailBody = (originName: string): string => `
You have been invited to collaborate on ${originName} on Apilytics.

You can view your invites in your dashboard at: ${FRONTEND_URL + staticRoutes.origins}`;

export const sendOriginInviteEmail = async ({
  email,
  originName,
}: {
  email: string;
  originName: string;
}): Promise<void> => {
  const { EMAIL_FROM = '' } = process.env;

  const params = {
    Source: EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [EMAIL_FROM],
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: getOriginInviteEmailBody(originName),
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Apilytics invite',
      },
    },
  };

  if (process.env.NODE_ENV === 'production') {
    try {
      await AWS_SES.sendEmail(params).promise();
    } catch (e) {
      console.error(e);
    }
  } else {
    console.log(params.Message.Subject);
    console.log(params.Message.Body);
  }
};

export const isEmailValid = (email: string): boolean => /\S@\S/.test(email);

export const hasWritePermissionsForOrigin = (role: string): boolean =>
  [ORIGIN_ROLES.OWNER, ORIGIN_ROLES.ADMIN].includes(role as ORIGIN_ROLES);

// Transform a route string from: '/api/blogs/<param>' into a wildcard pattern: '/api/blogs/%'
// Escapes % _ and \ so that they are treated as literals.
export const routeToPattern = (route: string): string => {
  return route
    .replace(/[%\\]/g, '\\$&')
    .replace(/<[a-z_-]+>/g, '%')
    .replace(/_/g, '\\_');
};

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones).
const getVerificationEmailText = ({ url, host }: Record<'url' | 'host', string>): string =>
  `Sign in to ${host}\n${url}\n\n`;

const getVerificationEmailHtml = ({
  url,
  host,
  email,
}: Record<'url' | 'host' | 'email', string>): string => {
  // Insert invisible space into domains and email address to prevent both the
  // email address and the domain from being turned into a hyperlink by email
  // clients like Outlook and Apple mail, as this is confusing because it seems
  // like they are supposed to click on their email address to sign in.
  const escapedEmail = `${email.replace(/\./g, '&#8203;.')}`;
  const escapedHost = `${host.replace(/\./g, '&#8203;.')}`;

  // Some simple styling options.
  const backgroundColor = '#f9f9f9';
  const textColor = '#444444';
  const mainBackgroundColor = '#ffffff';
  const buttonBackgroundColor = '#529dff';
  const buttonBorderColor = '#529dff';
  const buttonTextColor = '#ffffff';

  return `
<body style="background: ${backgroundColor};">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        <strong>${escapedHost}</strong>
      </td>
    </tr>
  </table>
  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Sign in as <strong>${escapedEmail}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Sign in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`;
};

export const sendVerificationRequest = async ({
  identifier: email,
  url,
  provider: { server, from },
}: {
  identifier: string;
  url: string;
  expires: Date;
  provider: EmailConfig;
  token: string;
}): Promise<void> => {
  const { host } = new URL(url);
  const text = getVerificationEmailText({ url, host });

  if (process.env.NODE_ENV === 'production') {
    const subject = `Sign in to ${host}`;
    const html = getVerificationEmailHtml({ url, host, email });
    const transport = nodemailer.createTransport(server);

    await transport.sendMail({
      to: email,
      from,
      subject,
      text,
      html,
    });
  } else {
    console.log(text);
  }
};

const DAY_MILLIS = 24 * 60 * 60 * 1000;
const THREE_MONTHS_MILLIS = 3 * 30 * DAY_MILLIS;

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
        ({ [key]: val, requests } as { [Key in K]: NonNullable<T[Key]> } & {
          requests: number;
        }),
    );

export const generateMetrics = async ({
  origin,
  query: {
    from = '',
    to = '',
    endpoint,
    method,
    statusCode,
    browser,
    os,
    device,
    country,
    region,
    city,
  },
}: {
  origin: Origin;
  query: {
    from?: string;
    to?: string;
    endpoint?: string;
    method?: string;
    statusCode?: string;
    browser?: string;
    os?: string;
    device?: string;
    country?: string;
    region?: string;
    city?: string;
  };
}): Promise<OriginMetrics> => {
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
  AND NOT EXISTS (
    SELECT 1 FROM excluded_routes
    WHERE excluded_routes.origin_id = ${originId}
      AND metrics.path LIKE excluded_routes.pattern
  )
  ${wherePath}
  ${method ? Prisma.sql`AND metrics.method = ${method}` : Prisma.empty}
  ${statusCode ? Prisma.sql`AND metrics.status_code = ${Number(statusCode)}` : Prisma.empty}
  ${browser ? Prisma.sql`AND metrics.browser = ${browser}` : Prisma.empty}
  ${os ? Prisma.sql`AND metrics.os = ${os}` : Prisma.empty}
  ${device ? Prisma.sql`AND metrics.device = ${device}` : Prisma.empty}
  ${country ? Prisma.sql`AND metrics.country = ${country}` : Prisma.empty}
  ${region ? Prisma.sql`AND metrics.region = ${region}` : Prisma.empty}
  ${city ? Prisma.sql`AND metrics.city = ${city}` : Prisma.empty}`;

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
  percentile_cont(0.5) WITHIN GROUP (ORDER BY metrics.time_millis) AS "responseTimeP50",
  percentile_cont(0.75) WITHIN GROUP (ORDER BY metrics.time_millis) AS "responseTimeP75",
  percentile_cont(0.9) WITHIN GROUP (ORDER BY metrics.time_millis) AS "responseTimeP90",
  percentile_cont(0.95) WITHIN GROUP (ORDER BY metrics.time_millis) AS "responseTimeP95",
  percentile_cont(0.99) WITHIN GROUP (ORDER BY metrics.time_millis) AS "responseTimeP99",

  ROUND(AVG(metrics.request_size)) AS "requestSizeAvg",
  percentile_cont(0.5) WITHIN GROUP (ORDER BY metrics.request_size) AS "requestSizeP50",
  percentile_cont(0.75) WITHIN GROUP (ORDER BY metrics.request_size) AS "requestSizeP75",
  percentile_cont(0.9) WITHIN GROUP (ORDER BY metrics.request_size) AS "requestSizeP90",
  percentile_cont(0.95) WITHIN GROUP (ORDER BY metrics.request_size) AS "requestSizeP95",
  percentile_cont(0.99) WITHIN GROUP (ORDER BY metrics.request_size) AS "requestSizeP99",

  ROUND(AVG(metrics.response_size)) AS "responseSizeAvg",
  percentile_cont(0.5) WITHIN GROUP (ORDER BY metrics.response_size) AS "responseSizeP50",
  percentile_cont(0.75) WITHIN GROUP (ORDER BY metrics.response_size) AS "responseSizeP75",
  percentile_cont(0.9) WITHIN GROUP (ORDER BY metrics.response_size) AS "responseSizeP90",
  percentile_cont(0.95) WITHIN GROUP (ORDER BY metrics.response_size) AS "responseSizeP95",
  percentile_cont(0.99) WITHIN GROUP (ORDER BY metrics.response_size) AS "responseSizeP99",

  ROUND(AVG(metrics.cpu_usage)) AS "cpuUsageAvg",
  percentile_cont(0.5) WITHIN GROUP (ORDER BY metrics.cpu_usage) AS "cpuUsageP50",
  percentile_cont(0.75) WITHIN GROUP (ORDER BY metrics.cpu_usage) AS "cpuUsageP75",
  percentile_cont(0.9) WITHIN GROUP (ORDER BY metrics.cpu_usage) AS "cpuUsageP90",
  percentile_cont(0.95) WITHIN GROUP (ORDER BY metrics.cpu_usage) AS "cpuUsageP95",
  percentile_cont(0.99) WITHIN GROUP (ORDER BY metrics.cpu_usage) AS "cpuUsageP99",

  ROUND(AVG(metrics.memory_usage)) AS "memoryUsageAvg",
  percentile_cont(0.5) WITHIN GROUP (ORDER BY metrics.memory_usage) AS "memoryUsageP50",
  percentile_cont(0.75) WITHIN GROUP (ORDER BY metrics.memory_usage) AS "memoryUsageP75",
  percentile_cont(0.9) WITHIN GROUP (ORDER BY metrics.memory_usage) AS "memoryUsageP90",
  percentile_cont(0.95) WITHIN GROUP (ORDER BY metrics.memory_usage) AS "memoryUsageP95",
  percentile_cont(0.99) WITHIN GROUP (ORDER BY metrics.memory_usage) AS "memoryUsageP99",

  ROUND(AVG(metrics.memory_total)) AS "memoryTotalAvg",
  percentile_cont(0.5) WITHIN GROUP (ORDER BY metrics.memory_total) AS "memoryTotalP50",
  percentile_cont(0.75) WITHIN GROUP (ORDER BY metrics.memory_total) AS "memoryTotalP75",
  percentile_cont(0.9) WITHIN GROUP (ORDER BY metrics.memory_total) AS "memoryTotalP90",
  percentile_cont(0.95) WITHIN GROUP (ORDER BY metrics.memory_total) AS "memoryTotalP95",
  percentile_cont(0.99) WITHIN GROUP (ORDER BY metrics.memory_total) AS "memoryTotalP99"

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

  const countryDataPromise: Promise<CountryData[]> = prisma.$queryRaw`
SELECT
  metrics.country,
  metrics.country_code AS "countryCode",
  COUNT(*) AS requests

${fromClause}
${whereClause}
  AND metrics.country IS NOT NULL

GROUP BY metrics.country, metrics.country_code;`;

  const regionDataPromise: Promise<RegionData[]> = prisma.$queryRaw`
SELECT
  metrics.region,
  metrics.country_code AS "countryCode",
  COUNT(*) AS requests

${fromClause}
${whereClause}
  AND metrics.region IS NOT NULL

GROUP BY metrics.region, metrics.country_code;`;

  const cityDataPromise: Promise<CityData[]> = prisma.$queryRaw`
SELECT
  metrics.city,
  metrics.country_code AS "countryCode",
  COUNT(*) AS requests

${fromClause}
${whereClause}
  AND metrics.city IS NOT NULL

GROUP BY metrics.city, metrics.country_code;`;

  const versionDataPromise = prisma.metric.findFirst({
    where: { originId },
    orderBy: { createdAt: 'desc' },
    select: { apilyticsVersion: true },
  });

  const [
    prevGeneralData,
    _generalData,
    timeFrameData,
    _endpointData,
    miscData,
    countryData,
    regionData,
    cityData,
    versionData,
  ] = await Promise.all([
    prevGeneralDataPromise,
    generalDataPromise,
    timeFrameDataPromise,
    endpointDataPromise,
    miscDataPromise,
    countryDataPromise,
    regionDataPromise,
    cityDataPromise,
    versionDataPromise,
  ]);

  const { totalRequests: prevTotalRequests, totalErrors: _prevTotalErrors } = prevGeneralData[0];
  const { totalRequests, totalErrors: _totalErrors, ...g } = _generalData[0];

  const prevTotalErrors = _prevTotalErrors ?? 0;
  const totalErrors = _totalErrors ?? 0;

  const totalRequestsGrowth = Number((totalRequests / prevTotalRequests).toFixed(2));
  const totalErrorsGrowth = Number((totalErrors / prevTotalErrors).toFixed(2));

  const prevErrorRate = Number((prevTotalErrors / prevTotalRequests).toFixed(2));
  const errorRate = totalErrors ? Number((totalErrors / totalRequests).toFixed(2)) : 0;
  const errorRateGrowth = errorRate ? Number((errorRate / prevErrorRate).toFixed(2)) : 0;

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

  const geoLocationData = {
    countryData,
    regionData,
    cityData,
  };

  const [identifier, version] = versionData?.apilyticsVersion?.split(';')[0].split('/') ?? [];

  const apilyticsPackage =
    !!identifier && !!version
      ? {
          identifier,
          version,
        }
      : undefined;

  return {
    generalData,
    timeFrameData,
    endpointData,
    percentileData,
    statusCodeData: extractFromMiscData(miscData, 'statusCode'),
    userAgentData,
    geoLocationData,
    apilyticsPackage,
  };
};
