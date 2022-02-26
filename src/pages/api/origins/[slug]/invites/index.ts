import {
  getOriginForUser,
  getSessionUserId,
  getSlugFromReq,
  hasWritePermissionsForOrigin,
  isEmailValid,
  makeMethodsHandler,
  sendOriginInviteEmail,
} from 'lib-server/apiHelpers';
import {
  sendConflict,
  sendCreated,
  sendInvalidInput,
  sendNotFound,
  sendOk,
  sendUnauthorized,
} from 'lib-server/responses';
import prisma from 'prisma/client';
import { isUniqueConstraintFailed } from 'prisma/errors';
import { withApilytics } from 'utils/apilytics';
import { ORIGIN_ROLES, PERMISSION_ERROR } from 'utils/constants';
import type { ApiHandler, MessageResponse, OriginInviteData } from 'types';

const getOriginInvites = async (slug: string): Promise<OriginInviteData[]> => {
  const _data = await prisma.originInvite.findMany({
    where: {
      origin: {
        slug,
      },
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  return _data.map(({ role, ...data }) => ({
    ...data,
    role: role as ORIGIN_ROLES,
  }));
};

const handleGet: ApiHandler<{ data: OriginInviteData[] }> = async (req, res) => {
  const slug = getSlugFromReq(req);
  const data = await getOriginInvites(slug);
  sendOk(res, { data });
};

const handlePost: ApiHandler<{ data: OriginInviteData[] } & MessageResponse> = async (req, res) => {
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

  const origin = await getOriginForUser({ userId, slug });

  if (!origin) {
    sendNotFound(res, 'Origin');
    return;
  }

  const { id: originId } = origin;
  const { email, role } = req.body;

  if (!isEmailValid(email)) {
    sendInvalidInput(res, 'Invalid email address.');
    return;
  }

  if (role! in ORIGIN_ROLES) {
    sendInvalidInput(res, 'Invalid role.');
    return;
  }

  const existingUser = await prisma.originUser.findFirst({
    where: {
      origin: { slug },
      user: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
    },
  });

  if (existingUser) {
    sendInvalidInput(res, 'A user with this email already exists for this origin.');
  }

  try {
    await prisma.originInvite.create({
      data: {
        email,
        role,
        originId,
      },
    });
  } catch (e) {
    if (isUniqueConstraintFailed(e)) {
      sendConflict(res, 'An invite with this email already exists for this origin.');
      return;
    }

    throw e;
  }

  sendOriginInviteEmail({ email, originName: origin.name });
  const data = await getOriginInvites(slug);
  sendCreated(res, { data, message: `An invite has been sent to ${email}` });
};

const handler = makeMethodsHandler({ GET: handleGet, POST: handlePost }, true);

export default withApilytics(handler);
