import { getSession } from 'next-auth/react';
import type { NextApiRequest } from 'next';
import type { Session } from 'next-auth';

import { sendMethodNotAllowed, sendUnauthorized, sendUnknownError } from 'lib-server/responses';
import { METHODS } from 'utils/constants';
import type { ApiHandler, Method } from 'types';

class UnauthorizedApiError extends Error {}

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
          console.error(e);
        }
        return;
      }
    }
    sendMethodNotAllowed(res, Object.keys(handlers));
  };

export const getSlugFromReq = (req: NextApiRequest): string => {
  const { slug } = req.query;

  if (typeof slug === 'string') {
    return slug;
  }

  throw new Error(`Invalid slug param in route: ${slug}`);
};

export const safeGetSessionUserId = async (
  req: NextApiRequest,
): Promise<Session['userId'] | null> => (await getSession({ req }))?.userId ?? null;

export const getSessionUserId = async (req: NextApiRequest): Promise<string> => {
  const userId = await safeGetSessionUserId(req);

  if (!userId) {
    throw new UnauthorizedApiError();
  }

  return userId;
};
