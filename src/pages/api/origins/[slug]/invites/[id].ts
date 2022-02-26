import {
  getIdFromReq,
  getOriginForUser,
  getSessionUserId,
  getSlugFromReq,
  hasWritePermissionsForOrigin,
  makeMethodsHandler,
  sendOriginInviteEmail,
} from 'lib-server/apiHelpers';
import {
  sendConflict,
  sendInvalidInput,
  sendNoContent,
  sendNotFound,
  sendOk,
  sendUnauthorized,
} from 'lib-server/responses';
import prisma from 'prisma/client';
import { isUniqueConstraintFailed } from 'prisma/errors';
import { withApilytics } from 'utils/apilytics';
import { PERMISSION_ERROR } from 'utils/constants';
import type { ApiHandler, MessageResponse } from 'types';

const handlePatch: ApiHandler<MessageResponse> = async (req, res) => {
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

  const id = getIdFromReq(req);
  const origin = await getOriginForUser({ userId, slug });

  if (!origin) {
    sendNotFound(res, 'Origin');
    return;
  }

  const { email } = req.body;

  if (!email) {
    sendInvalidInput(res, 'Missing email.');
  }

  await prisma.originInvite.update({
    where: {
      id,
    },
    data: {
      updatedAt: new Date(),
    },
  });

  sendOriginInviteEmail({ email, originName: origin.name });
  sendOk(res, { message: `A new invite has been sent to ${email}` });
};

// Can be called by either an origin admin or the invitee to accept/reject an invite.
const handleDelete: ApiHandler<MessageResponse> = async (req, res) => {
  const userId = await getSessionUserId(req);
  const slug = getSlugFromReq(req);

  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) {
    sendNotFound(res, 'User');
    return;
  }

  const inviteForInvitee = await prisma.originInvite.findFirst({
    where: {
      email: {
        equals: user.email,
        mode: 'insensitive',
      },
    },
  });

  const { id, role, accept } = req.body;

  if (accept) {
    if (!inviteForInvitee) {
      sendUnauthorized(res, 'You do not have permission to accept this invite.');
      return;
    }

    try {
      await prisma.originUser.create({
        data: { role, userId, originId: inviteForInvitee.originId },
      });
    } catch (e) {
      if (isUniqueConstraintFailed(e)) {
        sendConflict(res, 'A user with this email already exists for this origin.');
        return;
      }

      throw e;
    }
  } else {
    const originUser = await prisma.originUser.findFirst({
      where: { userId, origin: { slug } },
      select: { role: true },
    });

    if (originUser && !hasWritePermissionsForOrigin(originUser.role) && !inviteForInvitee) {
      sendUnauthorized(res, PERMISSION_ERROR);
      return;
    }
  }

  await prisma.originInvite.delete({ where: { id } });
  sendNoContent(res);
};

const handler = makeMethodsHandler({ PATCH: handlePatch, DELETE: handleDelete }, true);

export default withApilytics(handler);
