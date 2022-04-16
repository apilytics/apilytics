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
import type { ApiHandler, OriginMetrics } from 'types';

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

const handleGet: ApiHandler<{
  data: Pick<OriginMetrics, 'statusCodeData' | 'userAgentData' | 'apilyticsPackage'>;
}> = async (req, res) => {
  const userId = await getSessionUserId(req);
  const slug = getSlugFromReq(req);

  const { from, to, endpoint, method, statusCode, browser, os, device, country, region, city } =
    req.query as Record<string, string>;

  const origin = await getOriginForUser({ userId, slug });

  if (!origin) {
    sendNotFound(res, 'Origin');
    return;
  }

  const { id: originId } = origin;

  const fromDate = new Date(from);
  const toDate = new Date(to);

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

  const [miscData, versionData] = await Promise.all([miscDataPromise, versionDataPromise]);

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
    statusCodeData: extractFromMiscData(miscData, 'statusCode'),
    userAgentData,
    apilyticsPackage,
  };

  sendOk(res, { data });
};

const handler = makeMethodsHandler({ GET: handleGet }, true);

export default withApilytics(handler);
