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
  ip?: string;
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

const fetchGeoIp = async ({
  ip,
  retry,
}: {
  ip: string;
  retry: boolean;
}): Promise<{
  country: string | undefined;
  countryCode: string | undefined;
  region: string | undefined;
  city: string | undefined;
}> => {
  let country;
  let countryCode;
  let region;
  let city;

  try {
    const geoIpRes = await fetch('https://geoip.apilytics.io/geoip', {
      method: 'POST',
      body: JSON.stringify({ ip }),
      headers: {
        'X-API-Key': process.env.GEOIP_API_KEY ?? 'secret',
        'Content-Type': 'application/json',
      },
    });

    // 400 signals an invalid IP address.
    if (![200, 400].includes(geoIpRes.status)) {
      if (retry) {
        return fetchGeoIp({ ip, retry: false });
      }

      let message;
      try {
        message = await geoIpRes.clone().json();
      } catch {
        message = await geoIpRes.text();
      }

      console.error(
        `Got an unexpected status code from GeoIP API: ${geoIpRes.status}, message:\n`,
        message,
      );
    } else {
      ({
        country: { name: country, code: countryCode } = { name: undefined, code: undefined },
        region,
        city,
      } = await geoIpRes.json());
    }
  } catch (e) {
    console.error('Error when calling GeoIP API:\n', e);
  }

  return { country, countryCode, region, city };
};

const handlePost: ApiHandler = async (req, res) => {
  const apiKey = req.headers['x-api-key'];

  if (typeof apiKey !== 'string' || !apiKey) {
    sendApiKeyMissing(res);
    return;
  }

  let origin;

  try {
    origin = await prisma.origin.findUnique({
      where: { apiKey },
      select: {
        id: true,
        name: true,
        excludedRoutes: {
          select: {
            id: true,
            pattern: true,
          },
        },
        dynamicRoutes: {
          select: {
            id: true,
            pattern: true,
          },
        },
      },
    });
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
    query: _query,
    method,
    statusCode,
    timeMillis,
    requestSize: _requestSize,
    responseSize,
    userAgent: rawUserAgent,
    cpuUsage,
    memoryUsage,
    memoryTotal,
    ip,
  } = req.body as PostBody;

  const requestSize =
    _requestSize === undefined &&
    responseSize !== undefined &&
    METHODS_WITHOUT_BODY.includes(method.toUpperCase())
      ? 0
      : _requestSize;

  // eslint-disable-next-line no-control-regex
  const query = _query?.replace(/%00/g, '%2500'); // Escape encoded null bytes, as Postgres cannot serialize them into JSON.
  const queryParams = query ? Object.fromEntries(new URLSearchParams(query)) : undefined;

  const apilyticsVersion =
    typeof req.headers['apilytics-version'] === 'string'
      ? req.headers['apilytics-version']
      : undefined;

  let browser: string | undefined;
  let os: string | undefined;
  let device: string | undefined;

  if (rawUserAgent) {
    const ua = uaParser(rawUserAgent);
    browser = ua.browser.name;
    os = ua.os.name;
    device = ua.device.type;
  }

  let country;
  let countryCode;
  let region;
  let city;

  if (ip) {
    ({ country, countryCode, region, city } = await fetchGeoIp({ ip, retry: true }));
  }

  const matchPattern = ({ pattern }: { pattern: string }): boolean =>
    !!path.match(pattern.replace(/%/g, '[^/]+'));

  const excludedRouteId = origin.excludedRoutes.find(matchPattern)?.id;
  const dynamicRouteId = origin.dynamicRoutes.find(matchPattern)?.id;

  const data = {
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
    country,
    countryCode,
    region,
    city,
    apilyticsVersion,
    excludedRouteId,
    dynamicRouteId,
  };

  try {
    await prisma.metric.create({ data });
  } catch (e) {
    console.log({ origin: origin.name, ...data, query: _query });
    throw e;
  }

  sendOk(res);
};

const handler = makeMethodsHandler({ POST: handlePost }, false);

export default handler;
