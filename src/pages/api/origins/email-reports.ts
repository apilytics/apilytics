import { makeMethodsHandler } from 'lib-server/apiHelpers';
import { sendOk, sendUnauthorized, sendUnknownError } from 'lib-server/responses';
import prisma from 'prisma/client';
import { withApilytics } from 'utils/apilytics';
import { FRONTEND_URL } from 'utils/router';
import type { ApiHandler, MessageResponse } from 'types';

const handlePost: ApiHandler<MessageResponse> = async (req, res) => {
  if (req.headers['x-api-key'] !== process.env.INTERNAL_API_KEY) {
    sendUnauthorized(res, 'Invalid API key');
    return;
  }

  const _origins = await prisma.origin.findMany({
    where: {
      weeklyEmailReportsEnabled: true,
      OR: [
        {
          lastAutomaticWeeklyEmailReportsSentAt: {
            lt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6), // 6 days ago.
          },
        },
        {
          lastAutomaticWeeklyEmailReportsSentAt: null,
        },
      ],
    },
    select: { slug: true, weeklyEmailReportRecipients: true },
    take: 1, // Send only one report at a time to avoid connection pooling issues.
  });

  const origins = _origins.filter(
    ({ weeklyEmailReportRecipients }) => weeklyEmailReportRecipients.length > 0,
  );

  if (!origins.length) {
    sendOk(res, { message: 'All weekly email reports already sent, nothing to do.' });
    return;
  }

  for (const { slug } of origins) {
    const fetchResponse = await fetch(`${FRONTEND_URL}/api/origins/${slug}/email-reports`, {
      method: 'POST',
      headers: {
        'X-API-Key': process.env.INTERNAL_API_KEY ?? '',
      },
    });

    if (!fetchResponse.ok) {
      sendUnknownError(res);
      return;
    }
  }

  sendOk(res, { message: `Weekly email reports sent to ${origins.length} recipients.` });
};

const handler = makeMethodsHandler({ POST: handlePost }, false);

export default withApilytics(handler);
