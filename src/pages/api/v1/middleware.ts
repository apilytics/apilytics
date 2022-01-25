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
import { UNKNOWN_STATUS_CODE } from 'utils/constants';
import type { ApiHandler } from 'types';

type RequiredFields = Pick<Metric, 'path' | 'method' | 'timeMillis'>;

// All fields added after v1.0.0 middleware packages need to be optional to ensure backwards compatibility.
type OptionalFields = {
  query?: 'string';
  statusCode?: number | null; // Nullable for backwards compatibility.
  requestSize?: number;
  responseSize?: number;
  userAgent?: string;
};

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
      console.error('origin.findUnique error, req path:', req.url);
      console.error('origin.findUnique error, req headers:', req.headers);
      console.error('origin.findUnique error, req body:', req.body);
      throw e;
    }
    // Was not a valid UUID.
  }

  if (!origin) {
    sendInvalidApiKey(res);
    return;
  }

  const requiredFields: (keyof RequiredFields)[] = ['path', 'method', 'timeMillis'];
  const missing = requiredFields.filter((field) => req.body[field] === undefined);
  if (missing.length) {
    sendMissingInput(res, missing);
    return;
  }

  const { path, query, method, statusCode, timeMillis, requestSize, responseSize, userAgent } =
    req.body as PostBody;

  const queryParams = query ? Object.fromEntries(new URLSearchParams(query)) : undefined;

  const apilyticsVersion =
    typeof req.headers['apilytics-version'] === 'string'
      ? req.headers['apilytics-version']
      : undefined;

  try {
    await prisma.metric.create({
      data: {
        originId: origin.id,
        path,
        queryParams,
        method,
        statusCode: statusCode ?? UNKNOWN_STATUS_CODE,
        timeMillis,
        requestSize,
        responseSize,
        userAgent,
        apilyticsVersion,
      },
    });
  } catch (e) {
    console.error('metric.create error, req path:', req.url);
    console.error('metric.create error, req headers:', req.headers);
    console.error('metric.create error, req body:', req.body);
    throw e;
  }

  sendOk(res);
};

const handler = makeMethodsHandler({ POST: handlePost });

export default handler;
