import type { OriginRoute } from '@prisma/client';

import { getSessionUserId, getSlugFromReq, makeMethodsHandler } from 'lib-server/apiHelpers';
import { withAuthRequired } from 'lib-server/middleware';
import { sendConflict, sendInvalidInput, sendNotFound, sendOk } from 'lib-server/responses';
import prisma from 'prisma/client';
import { isUniqueConstraintFailed } from 'prisma/errors';
import { withApilytics } from 'utils/apilytics';
import type { ApiHandler } from 'types';

type Route = OriginRoute['route'];

interface RoutesResponse {
  data: Route[];
}

type RoutesPutBody = Route[];

// URL encode all non-valid URL characters, keep `<param>` style parameter indicating groups intact.
const encodeRoute = (route: string): string => {
  return encodeURI(route).replace(/%3C([a-z_-]+)%3E/g, '<$1>');
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

const getRoutes = async (originId: string): Promise<string[]> => {
  // No need to order by `part_count` here (as is done in paths API),
  // these get ordered very nicely without it.
  const result = await prisma.originRoute.findMany({
    where: { originId },
    select: {
      route: true,
    },
    orderBy: {
      route: 'asc',
    },
  });

  return result.map(({ route }) => route);
};

const handleGet: ApiHandler<RoutesResponse> = async (req, res) => {
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

const handlePut: ApiHandler<RoutesResponse> = async (req, res) => {
  const userId = await getSessionUserId(req);
  const slug = getSlugFromReq(req);

  const origin = await prisma.origin.findFirst({
    where: { slug, userId },
  });

  if (!origin) {
    sendNotFound(res, 'Origin');
    return;
  }

  const body = req.body;
  if (!Array.isArray(body) || (body.length && typeof body[0] !== 'string')) {
    sendInvalidInput(res);
    return;
  }

  const newRoutes = body as RoutesPutBody;

  const uniqueEncodedRoutes = Array.from(new Set(newRoutes.map((route) => encodeRoute(route))));

  const originRoutes = uniqueEncodedRoutes.map((route) => ({
    originId: origin.id,
    route,
    pattern: routeToPattern(route),
  }));

  try {
    await prisma.$transaction([
      prisma.originRoute.deleteMany({ where: { originId: origin.id } }),
      prisma.originRoute.createMany({ data: originRoutes }),
    ]);
  } catch (e) {
    if (isUniqueConstraintFailed(e)) {
      sendConflict(res, 'Two or more routes map to conflicting patterns.');
      return;
    }
    throw e;
  }

  const routes = await getRoutes(origin.id);

  sendOk(res, { data: routes });
};

const handler = withAuthRequired(makeMethodsHandler({ GET: handleGet, PUT: handlePut }));

export default withApilytics(handler);
