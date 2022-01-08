import type { Metric } from '@prisma/client';

import { makeMethodsHandler } from 'lib-server/apiHelpers';
import {
  sendApiKeyMissing,
  sendInvalidApiKey,
  sendInvalidInput,
  sendOk,
} from 'lib-server/responses';
import prisma from 'prismaClient';
import type { ApiHandler } from 'types';

type PostBody = Pick<Metric, 'path' | 'method' | 'statusCode' | 'timeMillis'>;

const handlePost: ApiHandler = async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (typeof apiKey !== 'string' || !apiKey) {
    sendApiKeyMissing(res);
    return;
  }

  const origin = await prisma.origin.findUnique({ where: { apiKey } });
  if (!origin) {
    sendInvalidApiKey(res);
    return;
  }

  const { path, method, statusCode, timeMillis } = req.body as PostBody;
  if ([path, method, statusCode, timeMillis].some((field) => field === undefined)) {
    sendInvalidInput(res);
    return;
  }

  await prisma.metric.create({
    data: { originId: origin.id, path, method, statusCode, timeMillis },
  });

  sendOk(res);
};

const handler = makeMethodsHandler({ POST: handlePost });

export default handler;
