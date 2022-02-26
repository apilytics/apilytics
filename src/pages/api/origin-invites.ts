import { getSessionUserId, makeMethodsHandler } from 'lib-server/apiHelpers';
import { sendNotFound, sendOk } from 'lib-server/responses';
import prisma from 'prisma/client';
import { withApilytics } from 'utils/apilytics';
import type { ApiHandler, OriginInviteData } from 'types';
import type { ORIGIN_ROLES } from 'utils/constants';

const handleGet: ApiHandler<{ data: OriginInviteData[] }> = async (req, res) => {
  const userId = await getSessionUserId(req);

  const user = await prisma.user.findFirst({ where: { id: userId } });

  if (!user) {
    sendNotFound(res, 'User');
    return;
  }

  const _data = await prisma.originInvite.findMany({
    where: {
      email: {
        equals: user.email,
        mode: 'insensitive',
      },
    },
    select: {
      id: true,
      role: true,
      origin: {
        select: {
          slug: true,
          name: true,
        },
      },
    },
  });

  const data = _data.map(({ id, role, origin: { slug: originSlug, name: originName } }) => ({
    id,
    role: role as ORIGIN_ROLES,
    originSlug,
    originName,
  }));

  sendOk(res, { data });
};

const handler = makeMethodsHandler({ GET: handleGet }, true);

export default withApilytics(handler);
