import { getSession } from 'next-auth/react';
import type { Origin } from '@prisma/client';
import type { NextApiRequest } from 'next';
import type { Session } from 'next-auth';

import { sendMethodNotAllowed, sendUnauthorized, sendUnknownError } from 'lib-server/responses';
import prisma from 'prisma/client';
import { METHODS, SAFE_METHODS } from 'utils/constants';
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
      if (!SAFE_METHODS.includes(method)) {
        const isAdmin = (await getSession({ req }))?.isAdmin;

        if (isAdmin) {
          sendUnauthorized(res, 'Only safe methods allowed for admin users.');
          return;
        }
      }

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

export async function getOriginForUser(params: {
  userId: string;
  slug?: never;
  many: true;
}): Promise<Origin[]>;
export async function getOriginForUser(params: {
  userId: string;
  slug: string;
  many?: false;
}): Promise<Origin | null>;
export async function getOriginForUser({
  userId,
  slug,
  many = false,
}: {
  userId: string;
  slug?: string;
  many?: boolean;
}): Promise<Origin | Origin[] | null> {
  const user = await prisma.user.findFirst({ where: { id: userId }, select: { isAdmin: true } });
  const where = user?.isAdmin ? {} : { userId };

  if (many) {
    return prisma.origin.findMany({
      where,
    });
  } else {
    return prisma.origin.findFirst({
      where: {
        slug,
        ...where,
      },
    });
  }
}
