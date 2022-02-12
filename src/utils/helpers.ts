import type { Method } from 'types';

export const truncateString = (str: string, maxLength: number): string =>
  str.length > maxLength ? `${str.slice(0, maxLength - 3)}...` : str;

export const getRandomArrayItem = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

export const getRandomNumberBetween = (min: number, max: number): number =>
  Number((Math.floor(Math.random() * max) + min).toFixed());

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
