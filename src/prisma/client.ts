import { PrismaClient } from '@prisma/client';

// Ignore: We want to avoid creating multiple Prisma clients when hot reloading in development.
// @ts-ignore
const prisma: PrismaClient = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  // Ignore: Same as above.
  // @ts-ignore
  global.prisma = prisma;
}

export default prisma;
