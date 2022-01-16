import type { ISODateString } from 'next-auth';

declare module 'next-auth' {
  // We have customized this in `[...nextauth].ts`.
  // https://github.com/nextauthjs/next-auth/discussions/536#discussioncomment-1487674

  type Session = {
    userId: string;
    expires: ISODateString;
  };
}
