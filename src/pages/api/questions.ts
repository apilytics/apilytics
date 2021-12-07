import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from 'prismaClient';

export interface QuestionsBody {
  id: string;
  role?: string;
  useCases?: string;
  howThisCouldHelp?: string;
  willingToPay?: boolean;
}

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed.' });
    return;
  }

  const { id, role, useCases, howThisCouldHelp, willingToPay }: QuestionsBody = req.body;
  if (!id) {
    res.status(400).json({ message: 'Missing id.' });
    return;
  }

  try {
    await prisma.user.update({
      where: { id },
      data: { role, useCases, howThisCouldHelp, willingToPay },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      res.status(404).json({ message: 'Invalid id.' });
      return;
    }

    throw e;
  }

  res.status(200).json({ message: 'Answer recorded.' });
};

export default handler;
