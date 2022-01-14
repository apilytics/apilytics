import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from 'prisma/client';

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  try {
    await prisma.$queryRaw`SELECT 1;`;
    res.status(200).end();
  } catch (e) {
    console.error('Health check failed:\n', e);
    res.status(503).end();
  }
};

export default handler;
