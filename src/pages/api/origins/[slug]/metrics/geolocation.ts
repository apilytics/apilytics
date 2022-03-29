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
import type { ApiHandler, CityData, CountryData, OriginMetrics, RegionData } from 'types';

const DAY_MILLIS = 24 * 60 * 60 * 1000;
const THREE_MONTHS_MILLIS = 3 * 30 * DAY_MILLIS;

const handleGet: ApiHandler<{ data: Pick<OriginMetrics, 'geoLocationData'> }> = async (
  req,
  res,
) => {
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

  const [countryData, regionData, cityData] = await Promise.all([
    countryDataPromise,
    regionDataPromise,
    cityDataPromise,
  ]);

  const data = {
    geoLocationData: {
      countryData,
      regionData,
      cityData,
    },
  };

  sendOk(res, { data });
};

const handler = makeMethodsHandler({ GET: handleGet }, true);

export default withApilytics(handler);
