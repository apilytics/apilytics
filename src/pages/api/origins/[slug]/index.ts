import slugify from 'slugify';

import {
  getOriginForUser,
  getSessionUserId,
  getSlugFromReq,
  hasWritePermissionsForOrigin,
  makeMethodsHandler,
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
import type { ApiHandler, MessageResponse, OriginData } from 'types';

const handleGet: ApiHandler<{ data: OriginData }> = async (req, res) => {
  const userId = await getSessionUserId(req);
  const slug = getSlugFromReq(req);
  const origin = await getOriginForUser({ userId, slug });

  if (!origin) {
    sendNotFound(res, 'Origin');
    return;
  }

  sendOk(res, { data: origin });
};

const handlePatch: ApiHandler<{ data: OriginData } & MessageResponse> = async (req, res) => {
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

  const { name } = req.body;

  if (!name) {
    sendInvalidInput(res);
    return;
  }

  const oldSlug = getSlugFromReq(req);
  const newSlug = slugify(name, { lower: true });

  try {
    await prisma.origin.update({
      where: { slug: oldSlug },
      data: { name, slug: newSlug },
    });
  } catch (e) {
    if (isUniqueConstraintFailed(e)) {
      sendConflict(res, 'This origin name has been taken.');
      return;
    }
    throw e;
  }

  const origin = await getOriginForUser({ userId, slug: newSlug });

  if (!origin) {
    sendNotFound(res, 'Origin');
    return;
  }

  sendOk(res, { data: origin, message: 'Origin settings saved.' });
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

  await prisma.origin.delete({
    where: { slug },
  });

  sendNoContent(res);
};

const handler = makeMethodsHandler(
  { GET: handleGet, PATCH: handlePatch, DELETE: handleDelete },
  true,
);

export default withApilytics(handler);
