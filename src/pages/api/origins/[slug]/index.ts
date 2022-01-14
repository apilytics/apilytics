import slugify from 'slugify';
import type { Origin } from '@prisma/client';

import { getSessionUserId, getSlugFromReq, makeMethodsHandler } from 'lib-server/apiHelpers';
import { withAuthRequired } from 'lib-server/middleware';
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

  const origin = await prisma.origin.findFirst({
    where: { slug, userId },
  });

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

  const origin = await prisma.origin.findFirst({
    where: { slug: newSlug, userId },
  });

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

const handler = withAuthRequired(
  makeMethodsHandler({ GET: handleGet, PUT: handlePut, DELETE: handleDelete }),
);

export default withApilytics(handler);
