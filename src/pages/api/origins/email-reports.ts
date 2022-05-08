import { makeMethodsHandler } from 'lib-server/apiHelpers';
import { sendOk, sendUnauthorized } from 'lib-server/responses';
import prisma from 'prisma/client';
import { withApilytics } from 'utils/apilytics';
import { FRONTEND_URL } from 'utils/router';
import type { ApiHandler, MessageResponse } from 'types';

const handlePost: ApiHandler<MessageResponse> = async (req, res) => {
  if (req.headers['x-api-key'] !== process.env.INTERNAL_API_KEY) {
    sendUnauthorized(res, 'Invalid API key');
    return;
  }

  const origins = await prisma.origin.findMany({
    where: { weeklyEmailReportsEnabled: true },
    select: { slug: true },
  });

  origins.forEach(({ slug }) => {
    fetch(`${FRONTEND_URL}/api/origins/${slug}/email-reports`, {
      method: 'POST',
      headers: {
        'X-API-Key': process.env.INTERNAL_API_KEY ?? '',
      },
    });
  });

  sendOk(res, { message: 'Weekly reports has been sent to the recipients.' });
};

const handler = makeMethodsHandler({ POST: handlePost }, false);

export default withApilytics(handler);
