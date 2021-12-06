import { Prisma, PrismaClient } from '@prisma/client';
import { decrypt } from 'encryption';
import type { NextApiRequest, NextApiResponse } from 'next';

const UNEXPECTED_ERROR = 'Unsubscribe failed.';

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed.' });
    return;
  }

  const { hash } = req.body;
  let email = '';

  try {
    email = decrypt(hash);
  } catch {
    // Decryption failed.
  }

  if (email.includes('@')) {
    const prisma = new PrismaClient();

    try {
      await prisma.unsubscriptions.create({ data: { email } });
    } catch (e) {
      // https://www.prisma.io/docs/concepts/components/prisma-client/handling-exceptions-and-errors
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        res.status(409).json({ message: 'You have alreay unsubsribed using this email.' });
        return;
      } else {
        throw e;
      }
    }
  } else {
    res.status(400).json({
      message: UNEXPECTED_ERROR,
    });

    return;
  }

  res.status(200).json({
    message: 'Unsubscribed successfully!',
  });
};

export default handler;
