import slugify from 'slugify';
import type { Origin } from '@prisma/client';

import {
  getOriginForUser,
  getSessionUserId,
  getSlugFromReq,
  makeMethodsHandler,
} from 'lib-server/apiHelpers';
import {
  sendConflict,
  sendInvalidInput,
  sendNoContent,
  sendNotFound,
  sendOk,
} from 'lib-server/responses';
import prisma from 'prisma/client';
import { isUniqueConstraintFailed } from 'prisma/errors';
import { withApilytics } from 'utils/apilytics';
import type { ApiHandler } from 'types';

interface OriginResponse {
  data: Origin;
}

const handleGet: ApiHandler<OriginResponse> = async (req, res) => {
  const userId = await getSessionUserId(req);
  const slug = getSlugFromReq(req);
  const origin = await getOriginForUser({ userId, slug });

  if (!origin) {
    sendNotFound(res, 'Origin');
    return;
  }

  sendOk(res, { data: origin });
};

const handlePut: ApiHandler<OriginResponse> = async (req, res) => {
  const userId = await getSessionUserId(req);
  const { name } = req.body;

  if (!name) {
    sendInvalidInput(res);
    return;
  }

  const oldSlug = getSlugFromReq(req);
  const newSlug = slugify(name, { lower: true });

  try {
    const { count } = await prisma.origin.updateMany({
      where: { slug: oldSlug, userId },
      data: { name, slug: newSlug },
    });

    if (count === 0) {
      sendNotFound(res, 'Origin');
      return;
    }
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

  sendOk(res, { data: origin });
};

const handleDelete: ApiHandler = async (req, res) => {
  const userId = await getSessionUserId(req);
  const slug = getSlugFromReq(req);

  const { count } = await prisma.origin.deleteMany({
    where: { slug, userId },
  });

  if (count === 0) {
    sendNotFound(res, 'Origin');
    return;
  }

  sendNoContent(res);
};

const handler = makeMethodsHandler({ GET: handleGet, PUT: handlePut, DELETE: handleDelete }, true);

export default withApilytics(handler);
