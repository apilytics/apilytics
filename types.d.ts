import type { ISODateString } from 'next-auth';

declare module 'next-auth' {
  // We have customized this in `[...nextauth].ts`.
  // Note that we're utilizing implicit interface merging here.
  // https://github.com/nextauthjs/next-auth/discussions/536#discussioncomment-1487674

  interface Session {
    userId: string;
    expires: ISODateString;
  }
}
