import { getSession } from 'next-auth/react';
import nodemailer from 'nodemailer';
import type { NextApiRequest } from 'next';
import type { EmailConfig } from 'next-auth/providers';

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

export const getOriginForUser = async ({
  userId,
  slug,
}: {
  userId: string;
  slug?: string;
}): Promise<OriginData | null> => {
  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: { isAdmin: true },
  });

  const where = user?.isAdmin ? { slug } : { originUsers: { some: { userId } }, slug };

  const origin = await prisma.origin.findFirst({
    where,
    include: {
      originUsers: { where: { userId }, select: { role: true } },
      dynamicRoutes: true,
      excludedRoutes: true,
    },
  });

  if (origin) {
    const { id, name, slug, apiKey, createdAt, updatedAt, dynamicRoutes, excludedRoutes } = origin;

    return {
      id,
      name,
      slug,
      apiKey,
      createdAt,
      updatedAt,
      userRole: origin.originUsers?.[0]?.role as ORIGIN_ROLES,
      // Cannot select count from these directly in the query.
      dynamicRouteCount: dynamicRoutes.length,
      excludedRouteCount: excludedRoutes.length,
    };
  }

  return null;
};

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

// Transform a route string from: '/api/blogs/<param>' into a wildcard pattern: '/api/blogs/%'
// Escapes % _ and \ so that they are treated as literals.
export const routeToPattern = (route: string): string => {
  return route
    .replace(/[%\\]/g, '\\$&')
    .replace(/<[a-z_-]+>/g, '%')
    .replace(/_/g, '\\_');
};

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones).
const getVerificationEmailText = ({ url, host }: Record<'url' | 'host', string>): string =>
  `Sign in to ${host}\n${url}\n\n`;

const getVerificationEmailHtml = ({
  url,
  host,
  email,
}: Record<'url' | 'host' | 'email', string>): string => {
  // Insert invisible space into domains and email address to prevent both the
  // email address and the domain from being turned into a hyperlink by email
  // clients like Outlook and Apple mail, as this is confusing because it seems
  // like they are supposed to click on their email address to sign in.
  const escapedEmail = `${email.replace(/\./g, '&#8203;.')}`;
  const escapedHost = `${host.replace(/\./g, '&#8203;.')}`;

  // Some simple styling options.
  const backgroundColor = '#f9f9f9';
  const textColor = '#444444';
  const mainBackgroundColor = '#ffffff';
  const buttonBackgroundColor = '#529dff';
  const buttonBorderColor = '#529dff';
  const buttonTextColor = '#ffffff';

  return `
<body style="background: ${backgroundColor};">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        <strong>${escapedHost}</strong>
      </td>
    </tr>
  </table>
  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Sign in as <strong>${escapedEmail}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Sign in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`;
};

export const sendVerificationRequest = async ({
  identifier: email,
  url,
  provider: { server, from },
}: {
  identifier: string;
  url: string;
  expires: Date;
  provider: EmailConfig;
  token: string;
}): Promise<void> => {
  const { host } = new URL(url);
  const transport = nodemailer.createTransport(server);
  const text = getVerificationEmailText({ url, host });

  if (process.env.NODE_ENV === 'production') {
    const subject = `Sign in to ${host}`;
    const html = getVerificationEmailHtml({ url, host, email });

    await transport.sendMail({
      to: email,
      from,
      subject,
      text,
      html,
    });
  } else {
    console.log(text);
  }
};
