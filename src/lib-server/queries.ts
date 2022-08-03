import type { DynamicRoute, ExcludedRoute, PrismaPromise } from '@prisma/client';

// Ignore: Must be a relative import since these queries are used by the DB seed script.
// eslint-disable-next-line no-restricted-imports
import prisma from '../prisma/client';

export const updateMetricsForNewDynamicRoute = ({
  originId,
  pattern,
  route,
}: Omit<DynamicRoute, 'id'>): PrismaPromise<void> => prisma.$queryRaw`
UPDATE metrics

SET
  dynamic_route_id = dynamic_routes.id,
  endpoint = ${route}

FROM dynamic_routes

WHERE dynamic_routes.origin_id = ${originId}::UUID
  AND dynamic_routes.route = ${route}
  AND metrics.origin_id = ${originId}::UUID
  AND metrics.path LIKE ${pattern}
  AND LENGTH(metrics.path) - LENGTH(REPLACE(metrics.path, '/', ''))
    = LENGTH(${pattern}) - LENGTH(REPLACE(${pattern}, '/', ''))`;

export const updateMetricsForNewExcludedRoute = ({
  originId,
  pattern,
  route,
}: Omit<ExcludedRoute, 'id'>): PrismaPromise<void> => prisma.$queryRaw`
UPDATE metrics

SET
  excluded_route_id = excluded_routes.id,
  endpoint = ${route}

FROM excluded_routes

WHERE excluded_routes.origin_id = ${originId}::UUID
  AND excluded_routes.route = ${route}
  AND metrics.origin_id = ${originId}::UUID
  AND metrics.path LIKE ${pattern}
  AND LENGTH(metrics.path) - LENGTH(REPLACE(metrics.path, '/', ''))
    = LENGTH(${pattern}) - LENGTH(REPLACE(${pattern}, '/', ''))`;
