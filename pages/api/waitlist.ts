import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma, PrismaClient } from '@prisma/client';
import { AWS_SES } from 'ses';
import { encrypt } from 'encryption';

const getEmailBody = (email: string) => `
Thanks for joining the waitlist for Apilytics!

Unsubscribe: https://apilytics.io/unsubscribe/${encrypt(email)}
`;

const sendWelcomeEmail = async (recipientEmail: string) => {
  const params = {
    Source: process.env.EMAIL_ADDRESS || '',
    Destination: {
      ToAddresses: [recipientEmail],
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: getEmailBody(recipientEmail),
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Welcome to Apilytics!',
      },
    },
  };

  if (process.env.NODE_ENV === 'production') {
    try {
      await AWS_SES.sendEmail(params).promise();
    } catch (e) {
      console.error(e);
    }
  } else {
    console.log(params.Message.Subject);
    console.log(params.Message.Body);
  }
};

const generateReferralCode = (): string => Math.random().toString(36).substr(2, 5);

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed.' });
    return;
  }

  const { email, usedReferralCode } = req.body;

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

  sendWelcomeEmail(email);
  res.status(201);
};

export default handler;
