import { Prisma } from '@prisma/client';

import { getSessionUser, makeMethodsHandler } from 'lib-server/apiHelpers';
import { withAuthRequired } from 'lib-server/middleware';
import { sendConflict, sendCreated, sendInvalidInput, sendOk } from 'lib-server/responses';
import prisma from 'prismaClient';
import type {
  ApiHandler,
  OriginsListGetResponse,
  OriginsPostBody,
  OriginsPostResponse,
} from 'types';

const handleGet: ApiHandler<OriginsListGetResponse> = async (req, res) => {
  const user = await getSessionUser(req);

  const origins = await prisma.origin.findMany({ where: { userId: user.id } });
  sendOk(res, { data: origins });
};

const handlePost: ApiHandler<OriginsPostResponse> = async (req, res) => {
  const user = await getSessionUser(req);

  const { domain }: OriginsPostBody = req.body;
  if (!domain) {
    sendInvalidInput(res);
    return;
  }

  let origin;
  try {
    origin = await prisma.origin.create({
      data: { userId: user.id, domain },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      sendConflict(res, 'Current user already has a origin with the given domain.');
      return;
    }
    throw e;
  }

  sendCreated(res, { data: origin });
};

const handler = withAuthRequired(makeMethodsHandler({ GET: handleGet, POST: handlePost }));

export default handler;