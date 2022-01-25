// Ignore: `ts-node` won't find these without relative imports.
import prisma from '../src/prisma/client'; // eslint-disable-line no-restricted-imports
import { MOCK_DYNAMIC_ROUTES, MOCK_METRICS } from '../src/utils/constants'; // eslint-disable-line no-restricted-imports

const USER_ID = 'ckyw15hbi000409l805yyhhfo';
const ORIGIN_ID = '201bb1b4-1376-484b-92f0-fa02552c9593';
const API_KEY = '0648c69d-4b42-4642-b125-0959619837cf';

// Generate random data for each hour of the past year.
// Each hour of the year will have 1-20 random data points with random endpoints, methods and response times.
const TEST_METRICS = Array(365 * 24)
  .fill(null)
  .map((_, i) =>
    Array(Math.floor(Math.random() * 20) + 1)
      .fill(null)
      .map(() => {
        const { path, method, status_codes } =
          MOCK_METRICS[Math.floor(Math.random() * MOCK_METRICS.length)];

        return {
          path,
          method,
          statusCode: status_codes[Math.floor(Math.random() * status_codes.length)],
          timeMillis: Math.floor(Math.random() * 100) + 20,
          createdAt: new Date(Date.now() - i * 60 * 60 * 1000),
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
      email: 'testuser@test.test',
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
