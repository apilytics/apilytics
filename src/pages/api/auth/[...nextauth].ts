import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

import prisma from 'prismaClient';

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  secret: process.env.SECRET_KEY,
  session: {
    strategy: 'jwt',
  },
});
