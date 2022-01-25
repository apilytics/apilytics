import { getSessionUserId, getSlugFromReq, makeMethodsHandler } from 'lib-server/apiHelpers';
import { withAuthRequired } from 'lib-server/middleware';
import { sendConflict, sendInvalidInput, sendNotFound, sendOk } from 'lib-server/responses';
import prisma from 'prisma/client';
import { isUniqueConstraintFailed } from 'prisma/errors';
import { withApilytics } from 'utils/apilytics';
import type { ApiHandler, DynamicRouteWithMatches } from 'types';

interface DynamicRoutesResponse {
  data: DynamicRouteWithMatches[];
}

// Remove all characters from the inputted route that are not valid in URL paths.
// In addition to added safety, this avoids us storing invalid escape sequences in our DB column.
// Keep `<param>` style parameter indicating groups intact.
// We cannot use url escaping here, since then we would end up double escaping the
// inputs when they are submitted again.
// URL path characters from: https://stackoverflow.com/a/4669755/9835872
const encodeRoute = (route: string): string => {
  return route
    .replace(/<(?![a-z_-]+>)|(?<!<[a-z_-]+)>/g, '')
    .replace(/[^A-Za-z0-9/._~!$&'()*+,;=:@%<>-]/g, '');
};

// Transform a route string from: '/api/blogs/<param>' into a regex pattern: '^/api/blogs/[^/]+$'
// Escapes *all* non-alphanumeric characters, to guarantee that Postgres treats them as literals.
// This is also less error-prone than manually listing the regex meta characters to escape.
// Keep `/` unescaped since it for sure isn't a meta character and this avoids lots of
// unnecessary escapes. More info:
// https://www.postgresql.org/docs/9.3/functions-matching.html#POSIX-ATOMS-TABLE
const routeToPattern = (route: string): string => {
  const escaped = route.replace(/[^A-Za-z0-9/]/g, '\\$&');
  return `^${escaped.replace(/\\<[a-z_-]+\\>/g, '[^/]+')}$`;
};

const getRoutes = async (originId: string): Promise<DynamicRouteWithMatches[]> => {
  const result: DynamicRouteWithMatches[] = await prisma.$queryRaw`
SELECT
  dynamic_routes.route,
  COUNT(DISTINCT metrics.path) AS matching_paths
FROM dynamic_routes
  LEFT JOIN metrics ON metrics.origin_id = dynamic_routes.origin_id
    AND metrics.path ~ dynamic_routes.pattern
WHERE dynamic_routes.origin_id = ${originId}
GROUP BY
  dynamic_routes.route;`;

  return result;
};

const handleGet: ApiHandler<DynamicRoutesResponse> = async (req, res) => {
  const userId = await getSessionUserId(req);
  const slug = getSlugFromReq(req);

  const origin = await prisma.origin.findFirst({
    where: { slug, userId },
  });

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

  const origin = await prisma.origin.findFirst({
    where: { slug, userId },
  });

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

  const uniqueEncodedRoutes = Array.from(new Set(body.map((route) => encodeRoute(route))));

  const data = uniqueEncodedRoutes.map((route) => ({
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
