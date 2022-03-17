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
  ORIGIN_ROLES,
} from '../src/utils/constants';
// eslint-disable-next-line no-restricted-imports
import {
  getRandomArrayItem,
  getRandomNumberBetween,
  getRandomStatusCodeForMethod,
} from '../src/utils/helpers';
// eslint-disable-next-line no-restricted-imports
import MOCK_COUNTRIES from '../src/utils/mock-countries.json';

const READ_ONLY_ADMIN_USER_ID = 'cl05jr6ya00003c5vzyhxqorj';
const ORIGIN_OWNER_USER_ID = 'cl05jr6ya00013c5v63ipw1jb';
const ORIGIN_ADMIN_USER_ID = 'cl05jr6ya00023c5vt2nkf4qj';
const ORIGIN_VIEWER_USER_ID = 'cl05jr6ya00033c5v9ei1co4g';
const ORIGIN_ID = '201bb1b4-1376-484b-92f0-fa02552c9593';
const API_KEY = '0648c69d-4b42-4642-b125-0959619837cf';

const getRandomNumberBetweenOrUndefined = (min: number, max: number): number | undefined =>
  Math.random() < 0.1 ? undefined : getRandomNumberBetween(min, max);

const TEST_DYNAMIC_ROUTES = MOCK_DYNAMIC_ROUTES.map(({ route, pattern }) => ({
  originId: ORIGIN_ID,
  route,
  pattern,
}));

const createMetrics = async ({
  hours,
  minDataPointsPerHour,
  maxDataPointsPerHour,
}: {
  hours: number;
  minDataPointsPerHour: number;
  maxDataPointsPerHour: number;
}): Promise<void> => {
  const metricsBatch = [];

  // Generate random data for each hour.
  for (let hourIndex = 0; hourIndex < hours; hourIndex++) {
    const metricsForHour = Array(getRandomNumberBetween(minDataPointsPerHour, maxDataPointsPerHour))
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
        const cpuUsage = Math.random();
        const memoryUsage = getRandomNumberBetweenOrUndefined(1_000_000, 2_000_000_000); // 100 MB - 2 GB.
        const memoryTotal = Math.random() < 0.1 ? undefined : MOCK_TOTAL_MEMORY;
        const _country = getRandomArrayItem([...MOCK_COUNTRIES, undefined]);
        const country = _country?.name;
        const countryCode = _country?.code;
        const _region = _country ? getRandomArrayItem([..._country.regions, undefined]) : undefined;
        const region = _region?.name;
        const city = _region ? getRandomArrayItem([..._region.cities, undefined]) : undefined;
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
          memoryUsage,
          memoryTotal,
          country,
          countryCode,
          region,
          city,
          originId: ORIGIN_ID,
        };
      });

    // Create metrics in batches of max 10 000 at a time.
    if (metricsBatch.length >= 10_000 || hourIndex === hours - 1) {
      await prisma.metric.createMany({ data: metricsBatch });
      metricsBatch.splice(0);
    }

    metricsBatch.push(...metricsForHour);
    const percentage = (hourIndex / hours) * 100;

    if (percentage % 10 === 0) {
      console.log(`Creating metrics, ${percentage.toFixed()}% complete.`);
    }
  }
};

const main = async (): Promise<void> => {
  // Delete and re-create test users to cascade changes to all relations.
  try {
    await prisma.user.delete({ where: { id: READ_ONLY_ADMIN_USER_ID } });
    await prisma.user.delete({ where: { id: ORIGIN_OWNER_USER_ID } });
    await prisma.user.delete({ where: { id: ORIGIN_ADMIN_USER_ID } });
    await prisma.user.delete({ where: { id: ORIGIN_VIEWER_USER_ID } });
  } catch {
    // User not found.
  }

  await prisma.user.create({
    data: {
      id: READ_ONLY_ADMIN_USER_ID,
      name: 'Test Admin User',
      email: 'admin@apilytics.io',
      isAdmin: true,
    },
  });

  console.log('Test read-only admin user created.');

  await prisma.user.create({
    data: {
      id: ORIGIN_OWNER_USER_ID,
      name: 'Test User',
      email: 'dev@apilytics.io',
      originUsers: {
        create: [
          {
            role: ORIGIN_ROLES.OWNER,
            origin: {
              create: {
                id: ORIGIN_ID,
                name: 'api.example.com',
                slug: 'api-example-com',
                apiKey: API_KEY,
              },
            },
          },
        ],
      },
    },
  });

  console.log('Test origin owner created.');

  await prisma.user.create({
    data: {
      id: ORIGIN_ADMIN_USER_ID,
      name: 'Test User 2',
      email: 'origin-admin@apilytics.io',
      originUsers: {
        create: [
          {
            role: ORIGIN_ROLES.ADMIN,
            origin: {
              connect: {
                id: ORIGIN_ID,
              },
            },
          },
        ],
      },
    },
  });

  console.log('Test origin admin created.');

  await prisma.user.create({
    data: {
      id: ORIGIN_VIEWER_USER_ID,
      name: 'Test User 3',
      email: 'origin-viewer@apilytics.io',
      originUsers: {
        create: [
          {
            role: ORIGIN_ROLES.VIEWER,
            origin: {
              connect: {
                id: ORIGIN_ID,
              },
            },
          },
        ],
      },
    },
  });

  console.log('Test origin viewer created.');

  await prisma.originInvite.create({
    data: {
      email: 'test-invitee@apilytics.io',
      role: ORIGIN_ROLES.ADMIN,
      origin: {
        connect: {
          id: ORIGIN_ID,
        },
      },
    },
  });

  console.log('Test origin invite created.');

  let hours;
  let minDataPointsPerHour;
  let maxDataPointsPerHour;

  if (process.env.VERCEL_ENV === 'preview') {
    hours = 7 * 24;
    minDataPointsPerHour = 0;
    maxDataPointsPerHour = 10;
  } else {
    hours = 365 * 24;
    minDataPointsPerHour = 10;
    maxDataPointsPerHour = 20;
  }

  await createMetrics({ hours, minDataPointsPerHour, maxDataPointsPerHour });

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
  } finally {
    await prisma.$disconnect();
  }
})();
