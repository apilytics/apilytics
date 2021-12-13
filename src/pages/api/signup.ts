import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from 'prismaClient';

export interface SignUpBody {
  email: string;
  role: string;
  useCases?: string;
  howThisCouldHelp?: string;
}

const EMAIL_REGEX = /^.+@.+$/;

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed.' });
    return;
  }

  const { email, role, useCases, howThisCouldHelp }: SignUpBody = req.body;

  if (!email || !role) {
    res.status(400).json({ message: 'Invalid input.' });
    return;
  }

  if (!email.match(EMAIL_REGEX)) {
    res.status(400).json({ message: 'Invalid email.' });
    return;
  }

  try {
    await prisma.user.create({ data: { email, role, useCases, howThisCouldHelp } });
  } catch (e) {
    // https://www.prisma.io/docs/concepts/components/prisma-client/handling-exceptions-and-errors
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      res.status(409).json({ message: 'This email had already been added to the waitlist.' });
      return;
    }

    throw e;
  }

  res.status(201).json({ message: 'Successfully added to the waitlist.' });
};

export default handler;
