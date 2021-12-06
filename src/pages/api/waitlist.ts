import { Prisma, PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed.' });
    return;
  }

  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: 'Missing email.' });
    return;
  }

  if (!email.includes('@')) {
    res.status(400).json({ message: 'Invalid email.' });
    return;
  }

  const prisma = new PrismaClient();
  let id;

  try {
    ({ id } = await prisma.user.create({
      data: { email },
    }));
  } catch (e) {
    // https://www.prisma.io/docs/concepts/components/prisma-client/handling-exceptions-and-errors
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      res.status(409).json({ message: 'This email had already been added to the waitlist.' });
      return;
    }

    throw e;
  }

  res.status(201);
};

export default handler;
