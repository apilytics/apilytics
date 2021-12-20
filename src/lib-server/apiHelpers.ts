import { getSession } from 'next-auth/react';
import type { NextApiRequest } from 'next';

import { sendMethodNotAllowed, sendUnauthorized, sendUnknownError } from 'lib-server/responses';
import type { ApiHandler, SessionUser } from 'lib-server/types';

class UnauthorizedApiError extends Error {}

const METHODS = [
  'GET',
  'HEAD',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'OPTIONS',
  'CONNECT',
  'TRACE',
] as const;

type Method = typeof METHODS[number];

const isMethod = (x: unknown): x is Method => {
  return METHODS.includes(x as Method);
};

type Handlers = {
  [key in Method]?: ApiHandler;
};

export const makeMethodsHandler =
  (handlers: Handlers): ApiHandler =>
  async (req, res): Promise<void> => {
    const { method } = req;
    if (isMethod(method)) {
      const handler = handlers[method];
      if (handler) {
        try {
          await handler(req, res);
        } catch (e) {
          if (e instanceof UnauthorizedApiError) {
            sendUnauthorized(res);
            return;
          }

          // Next.js's default 500 response is HTML based, but JSON is more easily comprehensible by our frontend.
          // This is only meant to be the last resort, and catches any completely unexpected errors.
          sendUnknownError(res);
          if (process.env.VERCEL_ENV === 'production') {
            console.error(e);
          } else {
            throw e;
          }
        }
        return;
      }
    }
    sendMethodNotAllowed(res, Object.keys(handlers));
  };

export const getIdFromReq = (req: NextApiRequest): string => {
  const { id } = req.query;
  if (typeof id === 'string') {
    return id;
  }
  throw new Error(`Invalid id param in route: ${id}`);
};

export const getSessionUser = async (req: NextApiRequest): Promise<SessionUser> => {
  const user = (await getSession({ req }))?.user;
  if (!user) {
    throw new UnauthorizedApiError();
  }
  return user;
};
