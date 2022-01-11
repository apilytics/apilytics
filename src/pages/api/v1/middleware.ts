import type { Metric } from '@prisma/client';

import { makeMethodsHandler } from 'lib-server/apiHelpers';
import {
  sendApiKeyMissing,
  sendInvalidApiKey,
  sendMissingInput,
  sendOk,
} from 'lib-server/responses';
import prisma from 'prismaClient';
import { withApilytics } from 'utils/apilytics';
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

  const requiredFields: (keyof PostBody)[] = ['path', 'method', 'statusCode', 'timeMillis'];
  const missing = requiredFields.filter((field) => req.body[field] === undefined);
  if (missing.length) {
    sendMissingInput(res, missing);
    return;
  }

  const { path, method, statusCode, timeMillis } = req.body as PostBody;

  await prisma.metric.create({
    data: { originId: origin.id, path, method, statusCode, timeMillis },
  });

  sendOk(res);
};

const handler = makeMethodsHandler({ POST: handlePost });

export default withApilytics(handler);
