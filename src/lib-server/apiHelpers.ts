import { getSession } from 'next-auth/react';
import type { NextApiRequest } from 'next';

import { sendMethodNotAllowed, sendUnauthorized, sendUnknownError } from 'lib-server/responses';
import prisma from 'prisma/client';
import { AWS_SES } from 'ses';
import { METHODS, ORIGIN_ROLES, SAFE_METHODS } from 'utils/constants';
import { FRONTEND_URL, staticRoutes } from 'utils/router';
import type { ApiHandler, Method, OriginData } from 'types';

class UnauthorizedApiError extends Error {}

const isMethod = (x: unknown): x is Method => {
  return METHODS.includes(x as Method);
};

type Handlers = {
  [key in Method]?: ApiHandler;
};

export const makeMethodsHandler =
  (handlers: Handlers, authRequired: boolean): ApiHandler =>
  async (req, res): Promise<void> => {
    const { method } = req;
    if (isMethod(method)) {
      if (authRequired) {
        const { userId, isAdmin } = (await getSession({ req })) ?? {};

        if (!userId) {
          sendUnauthorized(res);
          return;
        }

        if (isAdmin && !SAFE_METHODS.includes(method)) {
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

export const getIdFromReq = (req: NextApiRequest): string => {
  const { id } = req.query;

  if (typeof id === 'string') {
    return id;
  }

  throw new Error(`Invalid ıd param in route: ${id}`);
};

export const getSessionUserId = async (req: NextApiRequest): Promise<string> => {
  const { userId } = (await getSession({ req })) ?? {};

  if (!userId) {
    throw new UnauthorizedApiError();
  }

  return userId;
};

export async function getOriginForUser({
  userId,
  slug,
}: {
  userId: string;
  slug?: string;
}): Promise<OriginData | null> {
  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: { isAdmin: true },
  });

  const where = user?.isAdmin ? { slug } : { originUsers: { some: { userId } }, slug };

  const origin = await prisma.origin.findFirst({
    where,
    include: { originUsers: { where: { userId }, select: { role: true } } },
  });

  if (origin) {
    return {
      ...origin,
      userRole: origin.originUsers?.[0]?.role as ORIGIN_ROLES,
    };
  }

  return null;
}

const getOriginInviteEmailBody = (originName: string): string => `
You have been invited to collaborate on ${originName} on Apilytics.

You can view your invites in your dashboard at: ${FRONTEND_URL + staticRoutes.origins}`;

export const sendOriginInviteEmail = async ({
  email,
  originName,
}: {
  email: string;
  originName: string;
}): Promise<void> => {
  const { EMAIL_FROM = '' } = process.env;

  const params = {
    Source: EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [EMAIL_FROM],
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: getOriginInviteEmailBody(originName),
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Apilytics invite',
      },
    },
  };

  if (process.env.NODE_ENV === 'production') {
    try {
      await AWS_SES.sendEmail(params).promise();
    } catch (e) {
      console.error(e);
    }
  } else {
    console.log(params.Message.Subject);
    console.log(params.Message.Body);
  }
};

export const isEmailValid = (email: string): boolean => /\S@\S/.test(email);

export const hasWritePermissionsForOrigin = (role: string): boolean =>
  [ORIGIN_ROLES.OWNER, ORIGIN_ROLES.ADMIN].includes(role as ORIGIN_ROLES);
