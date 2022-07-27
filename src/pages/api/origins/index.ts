import { Prisma } from '@prisma/client';
import slugify from 'slugify';
import type { Origin } from '@prisma/client';

import { getSessionUserId, makeMethodsHandler } from 'lib-server/apiHelpers';
import {
  sendConflict,
  sendCreated,
  sendInvalidInput,
  sendNotFound,
  sendOk,
} from 'lib-server/responses';
import prisma from 'prisma/client';
import { isUniqueConstraintFailed } from 'prisma/errors';
import { withApilytics } from 'utils/apilytics';
import { ORIGIN_ROLES } from 'utils/constants';
import type { ApiHandler, OriginListItem } from 'types';

interface GetResponse {
  data: OriginListItem[];
}

const handleGet: ApiHandler<GetResponse> = async (req, res) => {
  const userId = await getSessionUserId(req);
  const user = await prisma.user.findFirst({ where: { id: userId }, select: { isAdmin: true } });

  const whereClause = !user?.isAdmin
    ? Prisma.sql`WHERE origin_users.user_id = ${userId}::UUID`
    : Prisma.empty;

  const data: OriginListItem[] = await prisma.$queryRaw`
  SELECT DISTINCT
    origins.name,
    origins.slug,
    COUNT(metrics)::INTEGER AS "lastDayMetrics",
    ${!user?.isAdmin ? Prisma.sql`origin_users.role` : Prisma.sql`'admin'`} AS "userRole",
    COUNT(DISTINCT origin_users)::INTEGER AS "userCount",
    COUNT(DISTINCT dynamic_routes)::INTEGER AS "dynamicRouteCount",
    COUNT(DISTINCT excluded_routes)::INTEGER AS "excludedRouteCount"

  FROM origins
    LEFT JOIN origin_users ON origin_users.origin_id = origins.id
    LEFT JOIN dynamic_routes ON dynamic_routes.origin_id = origins.id
    LEFT JOIN excluded_routes ON excluded_routes.origin_id = origins.id
    LEFT JOIN metrics ON metrics.origin_id = origins.id
      AND metrics.excluded_route_id IS NULL
      AND metrics.created_at >= NOW() - INTERVAL '1 day'

  ${whereClause}

  GROUP BY origins.id
  ORDER BY "lastDayMetrics" DESC;`;

  sendOk(res, { data });
};

interface PostResponse {
  data: Origin;
}

const handlePost: ApiHandler<PostResponse> = async (req, res) => {
  const userId = await getSessionUserId(req);
  const { name } = req.body;

  if (!name) {
    sendInvalidInput(res);
    return;
  }

  let origin: Origin | undefined;
  const slug = slugify(name, { lower: true });
  const user = await prisma.user.findFirst({ where: { id: userId } });

  if (!user) {
    sendNotFound(res, 'User not found.');
    return;
  }

  try {
    origin = await prisma.origin.create({
      data: {
        originUsers: {
          create: {
            role: ORIGIN_ROLES.OWNER,
            userId,
          },
        },
        weeklyEmailReportRecipients: {
          create: {
            email: user.email,
          },
        },
        name,
        slug,
      },
    });
  } catch (e) {
    if (isUniqueConstraintFailed(e)) {
      sendConflict(res, 'An origin with this name already exists.');
      return;
    }

    throw e;
  }

  sendCreated(res, { data: origin });
};

const handler = makeMethodsHandler({ GET: handleGet, POST: handlePost }, true);

export default withApilytics(handler);
