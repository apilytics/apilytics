import { Prisma } from '@prisma/client';
import prisma from 'prismaClient';
import type { NextApiRequest, NextApiResponse } from 'next';

interface RequestBody {
  email: string;
}

const EMAIL_REGEX = /^.+@.+$/;

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed.' });
    return;
  }

  const { email }: RequestBody = req.body;

  if (!email) {
    res.status(400).json({ message: 'Missing email.' });
    return;
  }

  if (!email.match(EMAIL_REGEX)) {
    res.status(400).json({ message: 'Invalid email.' });
    return;
  }

  try {
    await prisma.user.create({ data: { email } });
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