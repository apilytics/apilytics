import { PrismaClient } from '@prisma/client';

// Ignore: We want to avoid creating multiple Prisma clients when hot reloading in development.
// @ts-ignore
const prisma: PrismaClient = global.prisma || new PrismaClient();

if (process.env.LOG_PRISMA_QUERIES) {
  prisma.$use(async (params, next) => {
    const before = Date.now();
    const result = await next(params);
    const after = Date.now();
    console.log(`Query ${params.action} took ${after - before}ms`);
    return result;
  });
}

if (process.env.NODE_ENV === 'development') {
  // Ignore: Same as above.
  // @ts-ignore
  global.prisma = prisma;
}

export default prisma;
