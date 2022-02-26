import {
  getSessionUserId,
  getSlugFromReq,
  hasWritePermissionsForOrigin,
  makeMethodsHandler,
} from 'lib-server/apiHelpers';
import {
  sendInvalidInput,
  sendNoContent,
  sendNotFound,
  sendOk,
  sendUnauthorized,
} from 'lib-server/responses';
import prisma from 'prisma/client';
import { withApilytics } from 'utils/apilytics';
import { ORIGIN_ROLES, PERMISSION_ERROR } from 'utils/constants';
import type { ApiHandler, MessageResponse, OriginUserData } from 'types';

const handlePatch: ApiHandler<{ data: OriginUserData } & MessageResponse> = async (req, res) => {
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

  const { id, role }: OriginUserData = req.body;

  if (role! in [ORIGIN_ROLES.ADMIN, ORIGIN_ROLES.VIEWER]) {
    sendInvalidInput(res, 'Invalid role.');
  }

  const origin = await prisma.origin.findFirst({
    where: {
      slug,
      originUsers: {
        some: {
          id,
        },
      },
    },
  });

  if (!origin) {
    sendNotFound(res, 'Origin');
  }

  const updatedUser = await prisma.originUser.update({
    where: {
      id,
    },
    data: {
      role,
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

  const data = {
    id: updatedUser.id,
    role: updatedUser.role as ORIGIN_ROLES,
    email: updatedUser.user.email,
  };

  sendOk(res, { data, message: 'User permissions updated.' });
};

const handleDelete: ApiHandler = async (req, res) => {
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

  const { id }: OriginUserData = req.body;

  await prisma.originUser.delete({
    where: {
      id,
    },
  });

  sendNoContent(res);
};

const handler = makeMethodsHandler({ PATCH: handlePatch, DELETE: handleDelete }, true);

export default withApilytics(handler);
