import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from 'prismaClient';

export interface SignUpBody {
  role: string;
  useCases: string;
  howThisCouldHelp: string;
  willingToPay: boolean;
  email: string;
}

const EMAIL_REGEX = /^.+@.+$/;

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed.' });
    return;
  }

  const { role, useCases, howThisCouldHelp, willingToPay, email }: SignUpBody = req.body;

  if (!role || !useCases || !howThisCouldHelp || !willingToPay || !email) {
    res.status(400).json({ message: 'Invalid input.' });
    return;
  }

  if (!email.match(EMAIL_REGEX)) {
    res.status(400).json({ message: 'Invalid email.' });
    return;
  }

  try {
    await prisma.user.create({ data: { role, useCases, howThisCouldHelp, willingToPay, email } });
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
