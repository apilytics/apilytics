import {
  getOriginForUser,
  getSessionUserId,
  getSlugFromReq,
  hasWritePermissionsForOrigin,
  makeMethodsHandler,
  routeToPattern,
} from 'lib-server/apiHelpers';
import { updateMetricsForDynamicRoute } from 'lib-server/queries';
import {
  sendConflict,
  sendInvalidInput,
  sendNotFound,
  sendOk,
  sendUnauthorized,
} from 'lib-server/responses';
import prisma from 'prisma/client';
import { isUniqueConstraintFailed } from 'prisma/errors';
import { withApilytics } from 'utils/apilytics';
import { ORIGIN_ROLES, PERMISSION_ERROR } from 'utils/constants';
import type { ApiHandler, RouteData } from 'types';

const getRoutes = async (originId: string): Promise<RouteData[]> => {
  const result: RouteData[] = await prisma.$queryRaw`
SELECT
  dynamic_routes.route,
  COUNT(DISTINCT metrics.path) AS "matchingPaths"

FROM dynamic_routes
  LEFT JOIN metrics ON metrics.origin_id = dynamic_routes.origin_id
    AND metrics.dynamic_route_id IS NOT NULL
    AND metrics.path LIKE dynamic_routes.pattern
    AND LENGTH(metrics.path) - LENGTH(REPLACE(metrics.path, '/', ''))
      = LENGTH(dynamic_routes.pattern) - LENGTH(REPLACE(dynamic_routes.pattern, '/', ''))

WHERE dynamic_routes.origin_id = ${originId}

GROUP BY dynamic_routes.route
ORDER BY dynamic_routes.route;`;

  return result;
};

const handleGet: ApiHandler<{ data: RouteData[] }> = async (req, res) => {
  const userId = await getSessionUserId(req);
  const slug = getSlugFromReq(req);

  const originUser = await prisma.originUser.findFirst({
    where: { userId, origin: { slug } },
    select: { role: true },
  });

  if (!originUser) {
    const adminUser = await prisma.user.findFirst({ where: { id: userId, isAdmin: true } });

    if (!adminUser) {
      sendNotFound(res, 'OriginUser');
      return;
    }
  }

  const role = originUser?.role ?? ORIGIN_ROLES.ADMIN;

  if (!hasWritePermissionsForOrigin(role)) {
    sendUnauthorized(res, PERMISSION_ERROR);
    return;
  }

  const origin = await getOriginForUser({ userId, slug });

  if (!origin) {
    sendNotFound(res, 'Origin');
    return;
  }

  const routes = await getRoutes(origin.id);
  sendOk(res, { data: routes });
};

const handlePut: ApiHandler<{ data: RouteData[] }> = async (req, res) => {
  const userId = await getSessionUserId(req);
  const slug = getSlugFromReq(req);

  const originUser = await prisma.originUser.findFirst({
    where: { userId, origin: { slug } },
    select: { role: true },
  });

  if (!originUser) {
    sendNotFound(res, 'OriginUser');
    return;
  }

  if (!hasWritePermissionsForOrigin(originUser.role)) {
    sendUnauthorized(res, PERMISSION_ERROR);
    return;
  }

  const origin = await getOriginForUser({ userId, slug });

  if (!origin) {
    sendNotFound(res, 'Origin');
    return;
  }

  const { id: originId } = origin;
  const body: string[] = req.body;

  if (new Set(body).size !== body.length) {
    sendInvalidInput(res, 'The routes contain duplicate values.');
    return;
  }

  const data = body.map((route) => ({
    originId,
    route,
    pattern: routeToPattern(route),
  }));

  try {
    await prisma.$transaction([
      prisma.dynamicRoute.deleteMany({ where: { originId } }),
      prisma.dynamicRoute.createMany({ data }),
    ]);

    const newDynamicRoutes = await prisma.dynamicRoute.findMany({ where: { originId } });

    const queriesForNewDynamicRoutes = newDynamicRoutes.map(({ originId, pattern, id }) =>
      updateMetricsForDynamicRoute({
        originId,
        pattern,
        id,
      }),
    );

    await Promise.all(queriesForNewDynamicRoutes);
  } catch (e) {
    if (isUniqueConstraintFailed(e)) {
      sendConflict(res, 'Two or more routes map to conflicting patterns.');
      return;
    }

    throw e;
  }

  const routes = await getRoutes(originId);
  sendOk(res, { data: routes, message: 'Dynamic routes updated.' });
};

const handler = makeMethodsHandler({ GET: handleGet, PUT: handlePut }, true);

export default withApilytics(handler);
