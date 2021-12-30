import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

import prisma from 'prismaClient';
import { staticRoutes } from 'utils/router';

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  callbacks: {
    // Customized the callbacks to add `id` to the `session.user`.
    // https://github.com/nextauthjs/next-auth/discussions/536
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.uid;
        session.user.name = token.name ?? '';
      }

      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
        token.name = user.name;
      }
      return token;
    },
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
