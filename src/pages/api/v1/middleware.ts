import { makeMethodsHandler } from 'lib-server/apiHelpers';
import {
  sendApiKeyMissing,
  sendInvalidApiKey,
  sendInvalidInput,
  sendOk,
} from 'lib-server/responses';
import prisma from 'prismaClient';
import type { ApiHandler, MiddlewarePostBody } from 'types';

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

  const { path, method, timeMillis } = req.body as MiddlewarePostBody;
  if (!path || !method || !timeMillis) {
    sendInvalidInput(res);
    return;
  }

  await prisma.metric.create({
    data: { originId: origin.id, path, method, timeMillis },
  });

  sendOk(res);
};

const handler = makeMethodsHandler({ POST: handlePost });

export default handler;
