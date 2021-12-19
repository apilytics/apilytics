import type { NextApiRequest, NextApiResponse } from 'next';

// Our custom user that next-auth holds in its sessions.
export interface SessionUser {
  id: string;
  email: string;
}

export type ApiHandler<T = unknown> = (
  req: NextApiRequest,
  res: NextApiResponse<T>,
) => Promise<void>;
