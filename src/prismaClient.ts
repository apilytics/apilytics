import { PrismaClient } from '@prisma/client';

declare global {
  // Ignore: Must use `var` when declearing globals.
  /* eslint no-var: off */
  var prisma: PrismaClient;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export default prisma;
