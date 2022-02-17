import {
  getOriginForUser,
  getSessionUserId,
  getSlugFromReq,
  makeMethodsHandler,
} from 'lib-server/apiHelpers';
import { withAuthRequired } from 'lib-server/middleware';
import { sendConflict, sendInvalidInput, sendNotFound, sendOk } from 'lib-server/responses';
import prisma from 'prisma/client';
import { isUniqueConstraintFailed } from 'prisma/errors';
import { withApilytics } from 'utils/apilytics';
import type { ApiHandler, DynamicRouteWithMatches } from 'types';

interface DynamicRoutesResponse {
  data: DynamicRouteWithMatches[];
}

// Transform a route string from: '/api/blogs/<param>' into a wildcard pattern: '/api/blogs/%'
// Escapes % _ and \ so that they are treated as literals.
const routeToPattern = (route: string): string => {
  return route
    .replace(/[%\\]/g, '\\$&')
    .replace(/<[a-z_-]+>/g, '%')
    .replace(/_/g, '\\_');
};

const getRoutes = async (originId: string): Promise<DynamicRouteWithMatches[]> => {
  const result: DynamicRouteWithMatches[] = await prisma.$queryRaw`
SELECT
  dynamic_routes.route,
  COUNT(DISTINCT metrics.path) AS "matchingPaths"
FROM dynamic_routes
  LEFT JOIN metrics ON metrics.origin_id = dynamic_routes.origin_id
    AND metrics.path LIKE dynamic_routes.pattern
    AND LENGTH(metrics.path) - LENGTH(REPLACE(metrics.path, '/', ''))
      = LENGTH(dynamic_routes.pattern) - LENGTH(REPLACE(dynamic_routes.pattern, '/', ''))
WHERE dynamic_routes.origin_id = ${originId}
GROUP BY dynamic_routes.route
ORDER BY dynamic_routes.route;`;

  return result;
};

const handleGet: ApiHandler<DynamicRoutesResponse> = async (req, res) => {
  const userId = await getSessionUserId(req);
  const slug = getSlugFromReq(req);
  const origin = await getOriginForUser({ userId, slug });

  if (!origin) {
    sendNotFound(res, 'Origin');
    return;
  }

  const routes = await getRoutes(origin.id);
  sendOk(res, { data: routes });
};

const handlePut: ApiHandler<DynamicRoutesResponse> = async (req, res) => {
  const userId = await getSessionUserId(req);
  const slug = getSlugFromReq(req);
  const origin = await getOriginForUser({ userId, slug });

  if (!origin) {
    sendNotFound(res, 'Origin');
    return;
  }

  const { id: originId } = origin;
  const body: string[] = req.body;

  if (new Set(body).size !== body.length) {
    sendInvalidInput(res, 'This route is already in use.');
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
  } catch (e) {
    if (isUniqueConstraintFailed(e)) {
      sendConflict(res, 'Two or more routes map to conflicting patterns.');
      return;
    }

    throw e;
  }

  const routes = await getRoutes(originId);
  sendOk(res, { data: routes });
};

const handler = withAuthRequired(makeMethodsHandler({ GET: handleGet, PUT: handlePut }));

export default withApilytics(handler);
