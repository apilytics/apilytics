import type { ISODateString } from 'next-auth';

declare module 'next-auth' {
  // Don't use `interface` to avoid implicit interface merging with the original `Session`.
  type Session = {
    userId: string;
    expires: ISODateString;
    isAdmin: boolean;
  };

  interface JWT {
    isAdmin?: boolean;
  }
}
