// Ignore: `ts-node` won't find these without relative imports.
import prisma from '../src/prisma/client'; // eslint-disable-line no-restricted-imports
// eslint-disable-next-line no-restricted-imports
import {
  DEVICES,
  METHODS,
  MOCK_BROWSERS,
  MOCK_DYNAMIC_ROUTES,
  MOCK_OPERATING_SYSTEMS,
  MOCK_PATHS,
} from '../src/utils/constants';
// eslint-disable-next-line no-restricted-imports
import {
  getRandomArrayItem,
  getRandomNumberBetween,
  getRandomStatusCodeForMethod,
} from '../src/utils/helpers';

const USER_ID = 'ckyw15hbi000409l805yyhhfo';
const ORIGIN_ID = '201bb1b4-1376-484b-92f0-fa02552c9593';
const API_KEY = '0648c69d-4b42-4642-b125-0959619837cf';

const getRandomNumberBetweenOrUndefined = (min: number, max: number): number | undefined =>
  Math.random() < 0.1 ? undefined : getRandomNumberBetween(min, max);

// Generate random data for each hour of the past year.
// Each hour of the year will have 1-20 random data points with random endpoints, methods and response times.
const TEST_METRICS = Array(365 * 24)
  .fill(null)
  .map((_, i) =>
    Array(getRandomNumberBetween(1, 20))
      .fill(null)
      .map(() => {
        const path = getRandomArrayItem(MOCK_PATHS);
        const method = getRandomArrayItem(METHODS);
        const statusCode = getRandomStatusCodeForMethod(method);
        const timeMillis = getRandomNumberBetween(20, 100);
        const requestSize = getRandomNumberBetweenOrUndefined(0, 200_000);
        const responseSize = getRandomNumberBetweenOrUndefined(100_000, 200_00);
        const browser = getRandomArrayItem([...MOCK_BROWSERS, null]);
        const os = getRandomArrayItem([...MOCK_OPERATING_SYSTEMS, null]);
        const device = getRandomArrayItem([...DEVICES, null]);
        const createdAt = new Date(Date.now() - i * 60 * 60 * 1000);

        return {
          path,
          method,
          statusCode,
          timeMillis,
          requestSize,
          responseSize,
          browser,
          os,
          device,
          createdAt,
          originId: ORIGIN_ID,
        };
      }),
  )
  .flat();

const TEST_DYNAMIC_ROUTES = MOCK_DYNAMIC_ROUTES.map(({ route, pattern }) => ({
  originId: ORIGIN_ID,
  route,
  pattern,
}));

const main = async (): Promise<void> => {
  // Delete and re-create user to cascade changes to all relations.
  try {
    await prisma.user.delete({ where: { id: USER_ID } });
  } catch {
    // User does not exist.
  }

  await prisma.user.create({
    data: {
      id: USER_ID,
      name: 'Test User',
      email: 'dev@apilytics.io', // Real email, so we can receive login emails in preview.
      origins: {
        create: [
          {
            id: ORIGIN_ID,
            name: 'api.example.com',
            slug: 'api-example-com',
            apiKey: API_KEY,
          },
        ],
      },
    },
  });

  await Promise.all([
    prisma.metric.createMany({ data: TEST_METRICS }),
    prisma.dynamicRoute.createMany({ data: TEST_DYNAMIC_ROUTES }),
  ]);
};

(async (): Promise<void> => {
  try {
    await main();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
