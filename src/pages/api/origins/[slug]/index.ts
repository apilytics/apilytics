import { Prisma } from '@prisma/client';
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
import prisma from 'prismaClient';
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

  const slug = getSlugFromReq(req);

  try {
    const { count } = await prisma.origin.updateMany({
      where: { slug, userId },
      data: { name, slug },
    });

    if (count === 0) {
      sendNotFound(res, 'Origin');
      return;
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      sendConflict(res, 'This origin name has been taken.');
      return;
    }

    throw e;
  }

  const origin = await prisma.origin.findFirst({
    where: { slug, userId },
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
