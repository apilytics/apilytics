import type { IntervalDays, Method, ValueOf } from 'types';

// eslint-disable-next-line no-restricted-imports
import { INTERVAL_DAYS } from './constants';

export const truncateString = (str: string, maxLength: number): string =>
  str.length > maxLength ? `${str.slice(0, maxLength - 3)}...` : str;

export const getRandomArrayItem = <T>(arr: readonly T[]): T => {
  if (!arr.length) {
    throw new Error('Argument array cannot be empty.');
  }
  // @ts-expect-error: Array length checked above.
  return arr[Math.floor(Math.random() * arr.length)];
};

export const getRandomNumberBetween = (min: number, max: number): number =>
  Math.floor(Math.random() * max) + min;

export const getRandomStatusCodeForMethod = (method: Method): number => {
  const options = {
    GET: [200, 201, 204],
    HEAD: [200, 201, 204],
    POST: [201, 202],
    PUT: [201, 202],
    PATCH: [200, 201, 204],
    DELETE: [204],
    OPTIONS: [200, 201, 204],
    CONNECT: [200, 201, 204],
    TRACE: [200, 201, 204],
  };

  const errorCodes = [400, 401, 403, 404, 500];
  const statusCodes = options[method];
  const likelyHoodMultiplier = errorCodes.length * 3;

  // Repeat the possible non-error status codes to produce a more realistic distribution.
  const repeatedStatusCodes = Array.from(
    { length: likelyHoodMultiplier },
    () => statusCodes,
  ).flat();

  return getRandomArrayItem([...repeatedStatusCodes, ...errorCodes]);
};

export const getFlagEmoji = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
};

type ValuesOfUnion<T> = T extends T ? ValueOf<T> : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const safeGet = <T extends Record<keyof any, any>>(
  obj: T,
  prop: string,
): ValuesOfUnion<T> | undefined => {
  if (Object.prototype.hasOwnProperty.call(obj, prop)) {
    return obj[prop];
  } else {
    return undefined;
  }
};

export const isValidIntervalDays = (intervalDays: number): intervalDays is IntervalDays =>
  INTERVAL_DAYS.map(({ value }) => value).includes(intervalDays);
