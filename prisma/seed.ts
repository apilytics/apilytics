import { PrismaClient } from '@prisma/client';

// Ignore: The module is not found without a relative path.
// eslint-disable-next-line no-restricted-imports
import { MOCK_ENDPOINTS } from '../src/utils/constants';

const prisma = new PrismaClient();

const USER_ID = 'a58025e5-cd8a-4586-94b9-d38f51aa9e72';
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
        const { name, methods, status_codes } =
          MOCK_ENDPOINTS[Math.floor(Math.random() * MOCK_ENDPOINTS.length)];

        return {
          path: name,
          method: methods[Math.floor(Math.random() * methods.length)],
          statusCode: status_codes[Math.floor(Math.random() * status_codes.length)],
          timeMillis: Math.floor(Math.random() * 100) + 20,
          createdAt: new Date(Date.now() - i * 60 * 60 * 1000),
          originId: ORIGIN_ID,
        };
      }),
  )
  .flat();

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

  await prisma.metric.createMany({ data: TEST_METRICS });
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
