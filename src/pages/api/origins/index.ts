import { Prisma } from '@prisma/client';
import slugify from 'slugify';
import type { Origin } from '@prisma/client';

import { getSessionUserId, makeMethodsHandler } from 'lib-server/apiHelpers';
import { sendConflict, sendCreated, sendInvalidInput, sendOk } from 'lib-server/responses';
import prisma from 'prisma/client';
import { isUniqueConstraintFailed } from 'prisma/errors';
import { withApilytics } from 'utils/apilytics';
import type { ApiHandler, OriginListItem } from 'types';

interface GetResponse {
  data: OriginListItem[];
}

const handleGet: ApiHandler<GetResponse> = async (req, res) => {
  const userId = await getSessionUserId(req);
  const user = await prisma.user.findFirst({ where: { id: userId }, select: { isAdmin: true } });
  const whereClause = !user?.isAdmin ? Prisma.sql`WHERE origins.user_id = ${userId}` : Prisma.empty;

  const data: OriginListItem[] = await prisma.$queryRaw`
SELECT
  origins.name,
  origins.slug,
  COUNT(metrics) AS "totalMetrics",
  SUM(
    CASE WHEN metrics.created_at >= NOW() - INTERVAL '1 DAY' THEN 1 ELSE 0 END
  ) AS "lastDayMetrics"

FROM origins
  LEFT JOIN metrics ON origins.id = metrics.origin_id

${whereClause}

GROUP BY origins.name, origins.slug
ORDER BY "totalMetrics" DESC;`;

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

  try {
    origin = await prisma.origin.create({
      data: { userId, name, slug },
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
