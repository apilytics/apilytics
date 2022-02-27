import uaParser from 'ua-parser-js';
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
import { METHODS_WITHOUT_BODY, UNKNOWN_STATUS_CODE } from 'utils/constants';
import type { ApiHandler } from 'types';

type RequiredFields = Pick<Metric, 'path' | 'method' | 'timeMillis'>;

// All fields added after v1.0.0 middleware packages need to be optional to ensure backwards compatibility.
type OptionalFields = {
  query?: 'string';
  statusCode?: number | null; // Nullable for backwards compatibility.
  requestSize?: number;
  responseSize?: number;
  userAgent?: string;
  cpuUsage?: number;
  memoryUsage?: number;
  memoryTotal?: number;
};

type PostBody = RequiredFields & OptionalFields;

type Limits =
  | { min: number; max: number }
  | { min: number; max?: never }
  | { min?: never; max: number };

function limitValue(value: undefined, limits: Limits): undefined;
function limitValue(value: number, limits: Limits): number;
function limitValue(value: number | undefined, limits: Limits): number | undefined;
function limitValue(value: number | undefined, { min, max }: Limits): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (min !== undefined) {
    value = Math.max(value, min);
  }
  if (max !== undefined) {
    value = Math.min(value, max);
  }
  return value;
}

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

  const requiredFields: (keyof RequiredFields)[] = ['path', 'method', 'timeMillis'];
  const missing = requiredFields.filter((field) => req.body[field] === undefined);
  if (missing.length) {
    sendMissingInput(res, missing);
    return;
  }

  const {
    path,
    query,
    method,
    statusCode,
    timeMillis,
    requestSize: _requestSize,
    responseSize,
    userAgent: rawUserAgent,
    cpuUsage,
    memoryUsage,
    memoryTotal,
  } = req.body as PostBody;

  const requestSize =
    _requestSize === undefined &&
    responseSize !== undefined &&
    METHODS_WITHOUT_BODY.includes(method.toUpperCase())
      ? 0
      : _requestSize;

  const queryParams = query ? Object.fromEntries(new URLSearchParams(query)) : undefined;

  const apilyticsVersion =
    typeof req.headers['apilytics-version'] === 'string'
      ? req.headers['apilytics-version']
      : undefined;

  let browser;
  let os;
  let device;

  if (rawUserAgent) {
    const ua = uaParser(rawUserAgent);
    browser = ua.browser.name;
    os = ua.os.name;
    device = ua.device.type;
  }

  await prisma.metric.create({
    data: {
      originId: origin.id,
      path,
      queryParams,
      method,
      statusCode: statusCode ?? UNKNOWN_STATUS_CODE,
      timeMillis: limitValue(timeMillis, { min: 0 }),
      requestSize: limitValue(requestSize, { min: 0 }),
      responseSize: limitValue(responseSize, { min: 0 }),
      browser,
      os,
      device,
      cpuUsage: limitValue(cpuUsage, { min: 0, max: 1 }),
      memoryUsage: limitValue(memoryUsage, { min: 0 }),
      memoryTotal: limitValue(memoryTotal, { min: 0 }),
      apilyticsVersion,
    },
  });

  sendOk(res);
};

const handler = makeMethodsHandler({ POST: handlePost }, false);

export default handler;
