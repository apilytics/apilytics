import type { OriginRoute } from '@prisma/client';

import { getSessionUserId, getSlugFromReq, makeMethodsHandler } from 'lib-server/apiHelpers';
import { withAuthRequired } from 'lib-server/middleware';
import { sendInvalidInput, sendNotFound, sendOk } from 'lib-server/responses';
import prisma from 'prisma/client';
import { withApilytics } from 'utils/apilytics';
import type { ApiHandler } from 'types';

type Route = OriginRoute['route'];

interface RoutesResponse {
  data: Route[];
}

type RoutesPutBody = Route[];

// Transform a route string from: '/api/blogs/<param>' into a regex pattern: '^/api/blogs/[^/]+$'
const routeToPattern = (route: string): string => {
  return `^${route.replace(/<[a-z_-]+>/g, '[^/]+')}$`;
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

  const _routes = await prisma.originRoute.findMany({
    where: { originId: origin.id },
    select: {
      route: true,
    },
  });

  const routes = _routes.map(({ route }) => route);

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

  const routes = body as RoutesPutBody;

  const originRoutes = routes.map((route) => ({
    originId: origin.id,
    route,
    pattern: routeToPattern(route),
  }));

  await prisma.$transaction([
    prisma.originRoute.deleteMany({ where: { originId: origin.id } }),
    prisma.originRoute.createMany({ data: originRoutes }),
  ]);

  sendOk(res, { data: routes });
};

const handler = withAuthRequired(makeMethodsHandler({ GET: handleGet, PUT: handlePut }));

export default withApilytics(handler);
