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
import type { ApiHandler, EndpointData, OriginMetrics } from 'types';

type RawEndpointData = Omit<EndpointData, 'methodAndEndpoint'>;

const handleGet: ApiHandler<{ data: Pick<OriginMetrics, 'endpointData'> }> = async (req, res) => {
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

  const _endpointData: RawEndpointData[] = await prisma.$queryRaw`
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

  const endpointData = _endpointData.map((endpoint) => ({
    ...endpoint,
    methodAndEndpoint: `${endpoint.method} ${endpoint.endpoint}`,
  }));

  const data = {
    endpointData,
  };

  sendOk(res, { data });
};

const handler = makeMethodsHandler({ GET: handleGet }, true);

export default withApilytics(handler);
