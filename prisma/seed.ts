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
  MOCK_TOTAL_MEMORY,
} from '../src/utils/constants';
// eslint-disable-next-line no-restricted-imports
import {
  getRandomArrayItem,
  getRandomNumberBetween,
  getRandomStatusCodeForMethod,
} from '../src/utils/helpers';

const USER_ID = 'ckyw15hbi000409l805yyhhfo';
const ADMIN_USER_ID = 'ckzr8nnbj000009mo8pcb4jhe';
const ORIGIN_ID = '201bb1b4-1376-484b-92f0-fa02552c9593';
const API_KEY = '0648c69d-4b42-4642-b125-0959619837cf';

const getRandomNumberBetweenOrUndefined = (min: number, max: number): number | undefined =>
  Math.random() < 0.1 ? undefined : getRandomNumberBetween(min, max);

const TEST_DYNAMIC_ROUTES = MOCK_DYNAMIC_ROUTES.map(({ route, pattern }) => ({
  originId: ORIGIN_ID,
  route,
  pattern,
}));

const main = async (): Promise<void> => {
  // Delete and re-create user to cascade changes to all relations.
  try {
    await prisma.user.delete({ where: { id: USER_ID } });
    await prisma.user.delete({ where: { id: ADMIN_USER_ID } });
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

  console.log('Test user created.');

  await prisma.user.create({
    data: {
      id: ADMIN_USER_ID,
      name: 'Test Admin User',
      email: 'admin@apilytics.io',
      isAdmin: true,
    },
  });

  console.log('Test admin user created.');

  const metricsBatch = [];

  // Generate random data for each hour of the past year.
  // Each hour of the year will have 10-20 random data points.
  for (let hourIndex = 0; hourIndex < 365 * 24; hourIndex++) {
    const metricsForHour = Array(getRandomNumberBetween(10, 20))
      .fill(null)
      .map(() => {
        const path = getRandomArrayItem(MOCK_PATHS);
        const method = getRandomArrayItem(METHODS);
        const statusCode = getRandomStatusCodeForMethod(method);
        const timeMillis = getRandomNumberBetween(20, 100);
        const requestSize = getRandomNumberBetweenOrUndefined(0, 200_000);
        const responseSize = getRandomNumberBetweenOrUndefined(100_000, 200_00);
        const browser = getRandomArrayItem([...MOCK_BROWSERS, undefined]);
        const os = getRandomArrayItem([...MOCK_OPERATING_SYSTEMS, undefined]);
        const device = getRandomArrayItem([...DEVICES, undefined]);
        const cpuUsage = getRandomNumberBetweenOrUndefined(0, 100);
        const memoryUsage = getRandomNumberBetweenOrUndefined(1_000_000, 2_000_000_000); // 100 MB - 2 GB.
        const memoryTotal = Math.random() < 0.1 ? undefined : MOCK_TOTAL_MEMORY;
        const randomMinutes = getRandomNumberBetween(0, 60);
        const randomSeconds = getRandomNumberBetween(0, 60);
        const createdAt = new Date(Date.now() - hourIndex * randomMinutes * randomSeconds * 1000);

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
          cpuUsage,
          memoryTotal,
          memoryUsage,
          originId: ORIGIN_ID,
        };
      });

    // Create metrics in batches of max 10 000 at a time.
    if (metricsBatch.length === 10_000 || hourIndex === 365 * 24 - 1) {
      await prisma.metric.createMany({ data: metricsBatch });
      metricsBatch.splice(0, metricsBatch.length);
    }

    metricsBatch.push(...metricsForHour);
    const percentage = (hourIndex / (365 * 24)) * 100;

    if (percentage % 10 === 0) {
      console.log(`Creating metrics, ${percentage.toFixed()}% complete.`);
    }
  }

  console.log('Metrics created.');

  await prisma.dynamicRoute.createMany({ data: TEST_DYNAMIC_ROUTES });

  console.log('Dynamic routes created.');
};

(async (): Promise<void> => {
  try {
    await main();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
