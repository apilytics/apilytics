// Prisma error code reference: https://www.prisma.io/docs/reference/api-reference/error-reference
// There is no built-in, better way to handle this: https://github.com/prisma/prisma/issues/5040

import { Prisma } from '@prisma/client';

export const isUniqueConstraintFailed = (error: unknown): boolean => {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
};

export const isInconsistentColumnData = (error: unknown): boolean => {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2023';
};
