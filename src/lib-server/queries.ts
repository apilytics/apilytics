import type { DynamicRoute, ExcludedRoute, PrismaPromise } from '@prisma/client';

// Ignore: Must be a relative import since these queries are used by the DB seed script.
// eslint-disable-next-line no-restricted-imports
import prisma from '../prisma/client';

export const updateMetricsForDynamicRoute = ({
  originId,
  pattern,
  id: dynamicRouteId,
}: Pick<DynamicRoute, 'originId' | 'pattern' | 'id'>): PrismaPromise<void> => prisma.$queryRaw`
UPDATE metrics

SET dynamic_route_id = ${dynamicRouteId}

WHERE metrics.origin_id = ${originId}
  AND metrics.path LIKE ${pattern}
  AND LENGTH(metrics.path) - LENGTH(REPLACE(metrics.path, '/', ''))
    = LENGTH(${pattern}) - LENGTH(REPLACE(${pattern}, '/', ''))`;

export const updateMetricsForExcludedRoute = ({
  originId,
  pattern,
  id: excludedRouteId,
}: Pick<ExcludedRoute, 'originId' | 'pattern' | 'id'>): PrismaPromise<void> => prisma.$queryRaw`
UPDATE metrics

SET excluded_route_id = ${excludedRouteId}

WHERE metrics.origin_id = ${originId}
  AND metrics.path LIKE ${pattern}
  AND LENGTH(metrics.path) - LENGTH(REPLACE(metrics.path, '/', ''))
    = LENGTH(${pattern}) - LENGTH(REPLACE(${pattern}, '/', ''))`;
