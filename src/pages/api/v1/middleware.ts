import type { Metric } from '@prisma/client';

import { makeMethodsHandler } from 'lib-server/apiHelpers';
import {
  sendApiKeyMissing,
  sendInvalidApiKey,
  sendMissingInput,
  sendOk,
} from 'lib-server/responses';
import prisma from 'prisma/client';
import { isInconsistentColumnData } from 'prisma/errors';
import type { ApiHandler } from 'types';

type RequiredFields = Pick<Metric, 'path' | 'method' | 'statusCode' | 'timeMillis'>;

// All fields added after v1.0.0 middleware packages need to be optional to ensure backwards compatibility.
type OptionalFields = { query?: 'string' };
type PostBody = RequiredFields & OptionalFields;

const handlePost: ApiHandler = async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (typeof apiKey !== 'string' || !apiKey) {
    sendApiKeyMissing(res);
    return;
  }

  let origin;

  try {
    origin = await prisma.origin.findUnique({ where: { apiKey } });
  } catch (e) {
    if (!isInconsistentColumnData(e)) {
      throw e;
    }
    // Was not a valid UUID.
  }

  if (!origin) {
    sendInvalidApiKey(res);
    return;
  }

  const requiredFields: (keyof RequiredFields)[] = ['path', 'method', 'statusCode', 'timeMillis'];
  const missing = requiredFields.filter((field) => req.body[field] === undefined);
  if (missing.length) {
    sendMissingInput(res, missing);
    return;
  }

  const { path, query, method, statusCode, timeMillis } = req.body as PostBody;

  const queryParams = query ? Object.fromEntries(new URLSearchParams(query)) : undefined;

  const apilyticsVersion =
    typeof req.headers['apilytics-version'] === 'string'
      ? req.headers['apilytics-version']
      : undefined;

  await prisma.metric.create({
    data: {
      originId: origin.id,
      path,
      queryParams,
      method,
      statusCode,
      timeMillis,
      apilyticsVersion,
    },
  });

  sendOk(res);
};

const handler = makeMethodsHandler({ POST: handlePost });

export default handler;
