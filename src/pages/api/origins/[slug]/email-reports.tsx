import dayjs from 'dayjs';
import { getSession } from 'next-auth/react';
import nodemailer from 'nodemailer';
import ReactDOMServer from 'react-dom/server';

import { WeeklyReport } from 'components/layout/WeeklyReport';
import {
  generateMetrics,
  getOriginForUser,
  getSlugFromReq,
  hasWritePermissionsForOrigin,
  makeMethodsHandler,
} from 'lib-server/apiHelpers';
import { sendNotFound, sendOk, sendUnauthorized } from 'lib-server/responses';
import prisma from 'prisma/client';
import { AWS_SES } from 'ses';
import { withApilytics } from 'utils/apilytics';
import { PERMISSION_ERROR, REQUEST_TIME_FORMAT, SAFE_METHODS, WEEK_DAYS } from 'utils/constants';
import type { ApiHandler, MessageResponse } from 'types';

const sendWeeklyEmailReport = async ({
  recipients,
  name,
  body,
}: {
  recipients: string[];
  name: string;
  body: string;
}): Promise<void> => {
  const { EMAIL_FROM = '' } = process.env;
  const subject = `Apilytics weekly report for ${name}`;

  const params = {
    Source: EMAIL_FROM,
    Destination: {
      ToAddresses: recipients,
    },
    ReplyToAddresses: [EMAIL_FROM],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: body,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
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
    nodemailer.createTestAccount((_, account) => {
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      transporter
        .sendMail({ from: EMAIL_FROM, to: recipients, subject, html: body })
        .then((info) => {
          console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
        });
    });
  }
};

const handlePost: ApiHandler<MessageResponse> = async (req, res) => {
  const slug = getSlugFromReq(req);
  let userId;

  if (req.headers['x-api-key'] === process.env.INTERNAL_API_KEY) {
    const adminUser = await prisma.user.findFirst({
      where: { isAdmin: true },
      select: { id: true },
    });

    if (!adminUser) {
      sendNotFound(res, 'User');
      return;
    }

    userId = adminUser.id;
  } else {
    const { userId, isAdmin } = (await getSession({ req })) ?? {};

    if (!userId) {
      sendUnauthorized(res);
      return;
    }

    if (isAdmin && !SAFE_METHODS.includes(req.method ?? '')) {
      sendUnauthorized(res, 'Only safe methods allowed for admin users.');
      return;
    }

    const originUser = await prisma.originUser.findFirst({
      where: { userId, origin: { slug } },
      select: { role: true },
    });

    if (!originUser) {
      sendNotFound(res, 'OriginUser');
      return;
    }

    if (!hasWritePermissionsForOrigin(originUser.role)) {
      sendUnauthorized(res, PERMISSION_ERROR);
      return;
    }
  }

  const origin = await getOriginForUser({ userId: userId ?? '', slug });

  if (!origin) {
    sendNotFound(res, 'Origin');
    return;
  }

  const { id: originId } = origin;
  const _recipients = await prisma.weeklyEmailReportRecipient.findMany({ where: { originId } });
  const recipients = _recipients.map(({ email }) => email);

  const from = dayjs().subtract(WEEK_DAYS, 'day').format(REQUEST_TIME_FORMAT);
  const to = dayjs().format(REQUEST_TIME_FORMAT);

  const metrics = await generateMetrics({
    origin,
    query: {
      from,
      to,
    },
  });

  const weeklyReport = <WeeklyReport origin={origin} metrics={metrics} from={from} to={to} />;
  const body = ReactDOMServer.renderToStaticMarkup(weeklyReport);
  sendWeeklyEmailReport({ recipients, name: origin.name, body });
  sendOk(res, { message: 'Weekly report has been sent to the recipients.' });
};

const handler = makeMethodsHandler({ POST: handlePost }, false);

export default withApilytics(handler);
