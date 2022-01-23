import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

import prisma from 'prisma/client';
import { withApilytics } from 'utils/apilytics';
import { staticRoutes } from 'utils/router';

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session: async ({ session, token }) => ({
      userId: token.sub ?? '',
      expires: session.expires,
    }),
  },
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
  pages: {
    signIn: staticRoutes.login,
    signOut: staticRoutes.logout,
    error: staticRoutes.login,
    verifyRequest: staticRoutes.login,
  },
});

export default withApilytics(handler);
