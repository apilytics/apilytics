import type { DynamicRoute, PrismaPromise } from '@prisma/client';

// Ignore: Must be a relative import since these queries are used by the DB seed script.
// eslint-disable-next-line no-restricted-imports
import prisma from '../prisma/client';

export const updateMetricsForDynamicRoutes = ({
  originId,
}: Pick<DynamicRoute, 'originId'>): PrismaPromise<void> => prisma.$queryRaw`
UPDATE metrics

SET dynamic_route_id = (
  SELECT dynamic_routes.id
  FROM dynamic_routes
  WHERE dynamic_routes.origin_id = ${originId}
    AND metrics.path LIKE dynamic_routes.pattern
    AND LENGTH(metrics.path) - LENGTH(REPLACE(metrics.path, '/', ''))
      = LENGTH(dynamic_routes.pattern) - LENGTH(REPLACE(dynamic_routes.pattern, '/', ''))
)

WHERE metrics.origin_id = ${originId}`;

export const updateMetricsForExcludedRoutes = ({
  originId,
}: Pick<DynamicRoute, 'originId'>): PrismaPromise<void> => prisma.$queryRaw`
UPDATE metrics

SET excluded_route_id = (
  SELECT excluded_routes.id
  FROM excluded_routes
  WHERE excluded_routes.origin_id = ${originId}
    AND metrics.path LIKE excluded_routes.pattern
    AND LENGTH(metrics.path) - LENGTH(REPLACE(metrics.path, '/', ''))
      = LENGTH(excluded_routes.pattern) - LENGTH(REPLACE(excluded_routes.pattern, '/', ''))
)

WHERE metrics.origin_id = ${originId}`;
