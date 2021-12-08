import { mockDeep, mockReset } from 'jest-mock-extended';
import { createMocks } from 'node-mocks-http';
import type { PrismaClient } from '@prisma/client';
import type { DeepMockProxy } from 'jest-mock-extended';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Mocks, RequestOptions, ResponseOptions } from 'node-mocks-http';

import prisma from 'prismaClient';

export const mockNextApiReqRes = createMocks as (
  reqOptions?: RequestOptions,
  resOptions?: ResponseOptions,
  // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
) => Mocks<NextApiRequest, NextApiResponse>;

jest.mock('src/prismaClient', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
