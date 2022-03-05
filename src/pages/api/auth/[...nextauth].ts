import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

import { sendVerificationRequest } from 'lib-server/apiHelpers';
import prisma from 'prisma/client';
import { withApilytics } from 'utils/apilytics';
import { staticRoutes } from 'utils/router';

const SECONDS_IN_MONTH = 30 * 24 * 60 * 60;

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session: async ({ session, token }) => ({
      userId: token.sub ?? '',
      expires: session.expires,
      isAdmin: token.isAdmin ?? false,
    }),
    jwt: async ({ user, token }) => {
      if (user) {
        token.isAdmin = user.isAdmin;
      }

      return token;
    },
  },
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),
  ],
  secret: process.env.SECRET_KEY,
  session: {
    strategy: 'jwt',
    maxAge: process.env.NODE_ENV === 'production' ? SECONDS_IN_MONTH : SECONDS_IN_MONTH * 1000,
  },
  pages: {
    signIn: staticRoutes.login,
    signOut: staticRoutes.logout,
    error: staticRoutes.login,
    verifyRequest: staticRoutes.login,
  },
});

export default withApilytics(handler);
