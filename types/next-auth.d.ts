import type { ISODateString } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    userId: string;
    expires: ISODateString;
  }
}
