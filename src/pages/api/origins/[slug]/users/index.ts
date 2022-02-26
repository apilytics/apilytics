import { getSlugFromReq, makeMethodsHandler } from 'lib-server/apiHelpers';
import { sendOk } from 'lib-server/responses';
import prisma from 'prisma/client';
import { withApilytics } from 'utils/apilytics';
import { ORIGIN_ROLES } from 'utils/constants';
import type { ApiHandler, OriginUserData } from 'types';

const handleGet: ApiHandler<{ data: OriginUserData[] }> = async (req, res) => {
  const slug = getSlugFromReq(req);

  const _data = await prisma.originUser.findMany({
    where: {
      origin: {
        slug,
      },
    },
    select: {
      id: true,
      role: true,
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  const roleNumbers = {
    [ORIGIN_ROLES.VIEWER]: 1,
    [ORIGIN_ROLES.ADMIN]: 2,
    [ORIGIN_ROLES.OWNER]: 3,
  };

  const data = _data
    .map(({ id, role, user: { email } }) => ({
      id,
      role: role as ORIGIN_ROLES,
      email,
    }))
    .sort((a, b) => roleNumbers[b.role] - roleNumbers[a.role]);

  sendOk(res, { data });
};

const handler = makeMethodsHandler({ GET: handleGet }, true);

export default withApilytics(handler);
