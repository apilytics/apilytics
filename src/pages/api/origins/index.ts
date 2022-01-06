import { Prisma } from '@prisma/client';
import slugify from 'slugify';

import { getSessionUserId, makeMethodsHandler } from 'lib-server/apiHelpers';
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
  const userId = await getSessionUserId(req);

  // Get all origins for the user and the related metrics within 24 hours.
  const _origins = await prisma.origin.findMany({
    where: { userId },
    include: {
      metrics: {
        where: {
          createdAt: {
            gt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      },
    },
  });

  const origins = _origins.map((origin) => ({
    ...origin,
    last24hRequests: origin.metrics.length,
  }));

  sendOk(res, { data: origins });
};

const handlePost: ApiHandler<OriginsPostResponse> = async (req, res) => {
  const userId = await getSessionUserId(req);
  const { name }: OriginsPostBody = req.body;

  if (!name) {
    sendInvalidInput(res);
    return;
  }

  let origin;
  const slug = slugify(name);

  try {
    origin = await prisma.origin.create({
      data: { userId, name, slug },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      sendConflict(res, 'An origin with this name already exists.');
      return;
    }

    throw e;
  }

  sendCreated(res, { data: origin });
};

const handler = withAuthRequired(makeMethodsHandler({ GET: handleGet, POST: handlePost }));

export default handler;
