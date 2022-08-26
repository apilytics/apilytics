import { Prisma } from '@prisma/client';
import { getSession } from 'next-auth/react';
import nodemailer from 'nodemailer';
import type { Origin } from '@prisma/client';
import type { NextApiRequest } from 'next';
import type { EmailConfig } from 'next-auth/providers';

import { sendMethodNotAllowed, sendUnauthorized, sendUnknownError } from 'lib-server/responses';
import prisma from 'prisma/client';
import { AWS_SES } from 'ses';
import {
  METHODS,
  ONE_DAY,
  ORIGIN_ROLES,
  SAFE_METHODS,
  THREE_MONTHS_DAYS,
  WEEK_DAYS,
} from 'utils/constants';
import { FRONTEND_URL, staticRoutes } from 'utils/router';
import type { ApiHandler, IntervalDays, Method, OriginData, OriginMetrics } from 'types';

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

interface MetricsFilters {
  intervalDays?: IntervalDays;
  endpoint?: string;
  method?: string;
  statusCode?: string;
  browser?: string;
  os?: string;
  device?: string;
  country?: string;
  region?: string;
  city?: string;
}

interface Percentiles {
  avg: number;
  p50: number;
  p75: number;
  p90: number;
  p95: number;
  p99: number;
}

interface RawPercentileData {
  responseTime: Percentiles;
  requestSize: Percentiles;
  responseSize: Percentiles;
  cpuUsage: Percentiles;
  memoryUsage: Percentiles;
  memoryTotal: Percentiles;
}

export const generateMetrics = async ({
  origin: { id: originId },
  filters: {
    intervalDays = WEEK_DAYS,
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
  filters: MetricsFilters;
}): Promise<OriginMetrics> => {
  const interval = `'${intervalDays} days'`;

  let timeBucket;
  if (intervalDays === ONE_DAY) {
    timeBucket = Prisma.sql`'1 hour'`;
  } else if (intervalDays < THREE_MONTHS_DAYS) {
    timeBucket = Prisma.sql`'1 day'`;
  } else {
    timeBucket = Prisma.sql`'1 week'`;
  }

  let wherePath = Prisma.empty;

  if (endpoint) {
    const dynamicRoute = await prisma.dynamicRoute.findFirst({
      where: { originId, route: endpoint },
    });

    if (dynamicRoute) {
      wherePath = Prisma.sql`
AND metrics.dynamic_route_id = ${dynamicRoute.id}::UUID`;
    } else {
      wherePath = Prisma.sql`
AND metrics.dynamic_route_id IS NULL
AND metrics.path = ${endpoint}`;
    }
  }

  const baseWhereClause = Prisma.sql`
WHERE origins.id = ${originId}::UUID
  AND metrics.excluded_route_id IS NULL
  ${wherePath}
  ${method ? Prisma.sql`AND metrics.method = ${method}` : Prisma.empty}
  ${statusCode ? Prisma.sql`AND metrics.status_code = ${Number(statusCode)}` : Prisma.empty}
  ${browser ? Prisma.sql`AND metrics.browser = ${browser}` : Prisma.empty}
  ${os ? Prisma.sql`AND metrics.os = ${os}` : Prisma.empty}
  ${device ? Prisma.sql`AND metrics.device = ${device}` : Prisma.empty}
  ${country ? Prisma.sql`AND metrics.country = ${country}` : Prisma.empty}
  ${region ? Prisma.sql`AND metrics.region = ${region}` : Prisma.empty}
  ${city ? Prisma.sql`AND metrics.city = ${city}` : Prisma.empty}`;

  const _data: Array<OriginMetrics & { percentileData: RawPercentileData }> =
    await prisma.$queryRaw`
WITH all_metrics AS (
  SELECT
    metrics.*

  FROM metrics
    LEFT JOIN origins ON metrics.origin_id = origins.id

  ${baseWhereClause}
    AND metrics.created_at >= NOW() - ${interval}::INTERVAL
),

prev_general_data AS (
  SELECT
    COUNT(metrics) AS "totalRequests",
    COUNT(metrics) FILTER (WHERE is_error) AS "totalErrors"

  FROM metrics
    LEFT JOIN origins ON metrics.origin_id = origins.id

  ${baseWhereClause}
    AND metrics.created_at >= NOW() - ${interval}::INTERVAL * 2
    AND metrics.created_at <= NOW() - ${interval}::INTERVAL
),

general_data AS (
  SELECT
    COUNT(*) AS "totalRequests",
    COUNT(*) FILTER (WHERE is_error) AS "totalErrors"

  FROM all_metrics
),

error_rate_data AS (
  SELECT
    CASE WHEN prev_general_data."totalRequests" > 0 THEN ROUND(prev_general_data."totalErrors"::DECIMAL / prev_general_data."totalRequests"::DECIMAL, 2) ELSE '0.00'::DECIMAL END AS "prevErrorRate",
    CASE WHEN general_data."totalRequests" > 0 THEN ROUND(general_data."totalErrors"::DECIMAL / general_data."totalRequests"::DECIMAL, 2) ELSE '0.00'::DECIMAL END AS "errorRate"

  FROM general_data, prev_general_data
),

agg_general_data AS (
  SELECT
    general_data."totalRequests",
    general_data."totalErrors",
    error_rate_data."errorRate",
    CASE WHEN prev_general_data."totalRequests" > 0 THEN ROUND(((general_data."totalRequests"::DECIMAL - prev_general_data."totalRequests"::DECIMAL) / prev_general_data."totalRequests"::DECIMAL), 2) ELSE '0.00'::DECIMAL END AS "totalRequestsGrowth",
    CASE WHEN prev_general_data."totalErrors" > 0 THEN ROUND(((general_data."totalErrors"::DECIMAL - prev_general_data."totalErrors"::DECIMAL) / prev_general_data."totalErrors"::DECIMAL), 2) ELSE '0.00'::DECIMAL END AS "totalErrorsGrowth",
    CASE WHEN error_rate_data."prevErrorRate" != 0.00 THEN ROUND(((error_rate_data."errorRate"::DECIMAL - error_rate_data."prevErrorRate"::DECIMAL) / error_rate_data."prevErrorRate"::DECIMAL), 2) ELSE '0.00'::DECIMAL END AS "errorRateGrowth"

  FROM general_data, prev_general_data, error_rate_data
),

percentile_data AS (
  SELECT
    JSON_BUILD_OBJECT(
      'avg', ROUND(AVG(time_millis)::NUMERIC, 2),
      'p50', ROUND(percentile_cont(0.5) WITHIN GROUP (ORDER BY time_millis)::NUMERIC, 2),
      'p75', ROUND(percentile_cont(0.75) WITHIN GROUP (ORDER BY time_millis)::NUMERIC, 2),
      'p90', ROUND(percentile_cont(0.9) WITHIN GROUP (ORDER BY time_millis)::NUMERIC, 2),
      'p95', ROUND(percentile_cont(0.95) WITHIN GROUP (ORDER BY time_millis)::NUMERIC, 2),
      'p99', ROUND(percentile_cont(0.99) WITHIN GROUP (ORDER BY time_millis)::NUMERIC, 2)
    ) AS "responseTime",

    JSON_BUILD_OBJECT(
      'avg', ROUND(AVG(request_size)::NUMERIC, 2),
      'p50', ROUND(percentile_cont(0.5) WITHIN GROUP (ORDER BY request_size)::NUMERIC, 2),
      'p75', ROUND(percentile_cont(0.75) WITHIN GROUP (ORDER BY request_size)::NUMERIC, 2),
      'p90', ROUND(percentile_cont(0.9) WITHIN GROUP (ORDER BY request_size)::NUMERIC, 2),
      'p95', ROUND(percentile_cont(0.95) WITHIN GROUP (ORDER BY request_size)::NUMERIC, 2),
      'p99', ROUND(percentile_cont(0.99) WITHIN GROUP (ORDER BY request_size)::NUMERIC, 2)
    ) AS "requestSize",

    JSON_BUILD_OBJECT(
      'avg', ROUND(AVG(response_size)::NUMERIC, 2),
      'p50', ROUND(percentile_cont(0.5) WITHIN GROUP (ORDER BY response_size)::NUMERIC, 2),
      'p75', ROUND(percentile_cont(0.75) WITHIN GROUP (ORDER BY response_size)::NUMERIC, 2),
      'p90', ROUND(percentile_cont(0.9) WITHIN GROUP (ORDER BY response_size)::NUMERIC, 2),
      'p95', ROUND(percentile_cont(0.95) WITHIN GROUP (ORDER BY response_size)::NUMERIC, 2),
      'p99', ROUND(percentile_cont(0.99) WITHIN GROUP (ORDER BY response_size)::NUMERIC, 2)
    ) AS "responseSize",

    JSON_BUILD_OBJECT(
      'avg', ROUND(AVG(cpu_usage)::NUMERIC, 2),
      'p50', ROUND(percentile_cont(0.5) WITHIN GROUP (ORDER BY cpu_usage)::NUMERIC, 2),
      'p75', ROUND(percentile_cont(0.75) WITHIN GROUP (ORDER BY cpu_usage)::NUMERIC, 2),
      'p90', ROUND(percentile_cont(0.9) WITHIN GROUP (ORDER BY cpu_usage)::NUMERIC, 2),
      'p95', ROUND(percentile_cont(0.95) WITHIN GROUP (ORDER BY cpu_usage)::NUMERIC, 2),
      'p99', ROUND(percentile_cont(0.99) WITHIN GROUP (ORDER BY cpu_usage)::NUMERIC, 2)
    ) AS "cpuUsage",

    JSON_BUILD_OBJECT(
      'avg', ROUND(AVG(memory_usage)::NUMERIC, 2),
      'p50', ROUND(percentile_cont(0.5) WITHIN GROUP (ORDER BY memory_usage)::NUMERIC, 2),
      'p75', ROUND(percentile_cont(0.75) WITHIN GROUP (ORDER BY memory_usage)::NUMERIC, 2),
      'p90', ROUND(percentile_cont(0.9) WITHIN GROUP (ORDER BY memory_usage)::NUMERIC, 2),
      'p95', ROUND(percentile_cont(0.95) WITHIN GROUP (ORDER BY memory_usage)::NUMERIC, 2),
      'p99', ROUND(percentile_cont(0.99) WITHIN GROUP (ORDER BY memory_usage)::NUMERIC, 2)
    ) AS "memoryUsage",

    JSON_BUILD_OBJECT(
      'avg', ROUND(AVG(memory_total)::NUMERIC, 2),
      'p50', ROUND(percentile_cont(0.5) WITHIN GROUP (ORDER BY memory_total)::NUMERIC, 2),
      'p75', ROUND(percentile_cont(0.75) WITHIN GROUP (ORDER BY memory_total)::NUMERIC, 2),
      'p90', ROUND(percentile_cont(0.9) WITHIN GROUP (ORDER BY memory_total)::NUMERIC, 2),
      'p95', ROUND(percentile_cont(0.95) WITHIN GROUP (ORDER BY memory_total)::NUMERIC, 2),
      'p99', ROUND(percentile_cont(0.99) WITHIN GROUP (ORDER BY memory_total)::NUMERIC, 2)
    ) AS "memoryTotal"

  FROM all_metrics
),

endpoint_data AS (
  SELECT
    COUNT(*) AS "totalRequests",
    method,
    endpoint,
    CONCAT(method, ' ', endpoint) AS "methodAndEndpoint",
    ROUND(AVG(time_millis)::NUMERIC, 2) AS "responseTimeAvg"

  FROM all_metrics

  GROUP BY method, endpoint
  ORDER BY "totalRequests" DESC
  LIMIT 25
),

agg_endpoint_data AS (
  SELECT
    JSON_AGG(endpoint_data.*) AS "endpointData"

  FROM endpoint_data
),

time_frame_data AS (
  SELECT
    COUNT(*) AS requests,
    time_bucket(${timeBucket}, metrics.created_at) AS time,
    COUNT(*) FILTER (WHERE is_error) AS errors

  FROM metrics
    LEFT JOIN origins ON metrics.origin_id = origins.id

  ${baseWhereClause}
    AND metrics.created_at >= NOW() - ${interval}::INTERVAL

  GROUP BY time
  ORDER BY time DESC
),

agg_time_frame_data AS (
  SELECT
    JSON_AGG(time_frame_data.*) AS "timeFrameData"

  FROM time_frame_data
),

browser_data AS (
  SELECT
    browser,
    COUNT(*) AS requests

  FROM all_metrics
  WHERE browser IS NOT NULL
  GROUP BY browser
  ORDER BY requests DESC
  LIMIT 25
),

os_data AS (
  SELECT
    os,
    COUNT(*) AS requests

  FROM all_metrics
  WHERE os IS NOT NULL
  GROUP BY os
  ORDER BY requests DESC
  LIMIT 25
),

device_data AS (
  SELECT
    device,
    COUNT(*) AS requests

  FROM all_metrics
  WHERE device IS NOT NULL
  GROUP BY device
  ORDER BY requests DESC
  LIMIT 25
),

agg_user_agent_data AS (
  SELECT
    JSON_AGG(DISTINCT browser_data.*) AS "browserData",
    JSON_AGG(DISTINCT os_data.*) AS "osData",
    JSON_AGG(DISTINCT device_data.*) AS "deviceData"

  FROM browser_data, os_data, device_data
),

status_code_data AS (
  SELECT
    status_code AS "statusCode",
    COUNT(*) AS requests

  FROM all_metrics
  WHERE status_code IS NOT NULL
  GROUP BY status_code
  ORDER BY requests DESC
  LIMIT 25
),

agg_status_code_data AS (
  SELECT
    JSON_AGG(status_code_data.*) AS "statusCodeData"

  FROM status_code_data
),

country_data AS (
  SELECT
    country,
    country_code AS "countryCode",
    COUNT(*) AS requests

  FROM all_metrics
  WHERE country IS NOT NULL
  GROUP BY country, country_code
  ORDER BY requests DESC
  LIMIT 25
),

region_data AS (
  SELECT
    region,
    country_code AS "countryCode",
    COUNT(*) AS requests

  FROM all_metrics
  WHERE region IS NOT NULL
  GROUP BY region, country_code
  ORDER BY requests DESC
  LIMIT 25
),

city_data AS (
  SELECT
    city,
    country_code AS "countryCode",
    COUNT(*) AS requests

  FROM all_metrics
  WHERE city IS NOT NULL
  GROUP BY city, country_code
  ORDER BY requests DESC
  LIMIT 25
),

agg_geo_location_data AS (
  SELECT
    JSON_AGG(DISTINCT country_data.*) AS "countryData",
    JSON_AGG(DISTINCT region_data.*) AS "regionData",
    JSON_AGG(DISTINCT city_data.*) AS "cityData"

  FROM country_data, region_data, city_data
),

version_data AS (
  SELECT
    SPLIT_PART(SPLIT_PART(apilytics_version, ';', 1)::TEXT, '/', 1) AS identifier,
    SPLIT_PART(SPLIT_PART(apilytics_version, ';', 1)::TEXT, '/', 2) AS version

  FROM metrics
  WHERE origin_id = ${originId}::UUID
    AND apilytics_version IS NOT NULL

  ORDER BY created_at DESC
  LIMIT 1
),

json_data AS (
  SELECT
    TO_JSONB(agg_general_data.*) AS "generalData",
    agg_endpoint_data.*,
    TO_JSONB(percentile_data.*) AS "percentileData",
    agg_time_frame_data.*,
    TO_JSONB(agg_user_agent_data.*) AS "userAgentData",
    agg_status_code_data.*,
    TO_JSONB(agg_geo_location_data.*) AS "geoLocationData",
    TO_JSONB(version_data.*) AS "apilyticsPackage"

  FROM agg_general_data,
    agg_endpoint_data,
    percentile_data,
    agg_time_frame_data,
    agg_user_agent_data,
    agg_status_code_data,
    agg_geo_location_data,
    version_data
)

SELECT * FROM json_data;`;

  const data = _data[0] as typeof _data[number] | undefined; // Improve type-checking.
  const {
    timeFrameData: _timeFrameData,
    endpointData: _endpointData,
    percentileData: _percentileData,
    statusCodeData: _statusCodeData,
    userAgentData: _userAgentData,
    geoLocationData: _geoLocationData,
    generalData: _generalData,
    apilyticsPackage,
  } = data ?? {};

  const timeFrameData = _timeFrameData ?? [];
  const endpointData = _endpointData ?? [];

  const PERCENTILE_DATA_KEYS = ['avg', 'p50', 'p75', 'p90', 'p95', 'p99'] as const;

  const percentileData = PERCENTILE_DATA_KEYS.map((key) => ({
    key,
    responseTime: _percentileData?.responseTime[key] ?? null,
    requestSize: _percentileData?.requestSize[key] ?? null,
    responseSize: _percentileData?.responseSize[key] ?? null,
    cpuUsage: _percentileData?.cpuUsage[key] ?? null,
    memoryUsage: _percentileData?.memoryUsage[key] ?? null,
    memoryTotal: _percentileData?.memoryTotal[key] ?? null,
  }));

  const statusCodeData = _statusCodeData ?? [];

  const userAgentData = {
    browserData: _userAgentData?.browserData ?? [],
    osData: _userAgentData?.osData ?? [],
    deviceData: _userAgentData?.deviceData ?? [],
  };

  const geoLocationData = {
    countryData: _geoLocationData?.countryData ?? [],
    regionData: _geoLocationData?.regionData ?? [],
    cityData: _geoLocationData?.cityData ?? [],
  };

  const generalData = {
    totalRequests: _generalData?.totalRequests ?? 0,
    totalRequestsGrowth: _generalData?.totalRequestsGrowth ?? 0,
    totalErrors: _generalData?.totalErrors ?? 0,
    totalErrorsGrowth: _generalData?.totalErrorsGrowth ?? 0,
    errorRate: _generalData?.errorRate ?? 0,
    errorRateGrowth: _generalData?.errorRateGrowth ?? 0,
  };

  return {
    timeFrameData,
    endpointData,
    percentileData,
    statusCodeData,
    userAgentData,
    geoLocationData,
    generalData,
    apilyticsPackage,
  };
};
