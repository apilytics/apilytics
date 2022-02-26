import type { User } from '@prisma/client';

import { getSessionUserId, makeMethodsHandler } from 'lib-server/apiHelpers';
import { sendInvalidInput, sendNotFound, sendOk } from 'lib-server/responses';
import prisma from 'prisma/client';
import { withApilytics } from 'utils/apilytics';
import type { ApiHandler, MessageResponse } from 'types';

const handleGet: ApiHandler<{ data: User }> = async (req, res) => {
  const id = await getSessionUserId(req);
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    sendNotFound(res, 'User');
    return;
  }

  sendOk(res, { data: user });
};

const handlePut: ApiHandler<{ data: User } & MessageResponse> = async (req, res) => {
  const id = await getSessionUserId(req);
  const { name, email, usedTechnologies, intendedUse } = req.body;

  if (!name || !email) {
    sendInvalidInput(res);
    return;
  }

  const user = await prisma.user.update({
    where: { id },
    data: { name, email, usedTechnologies, intendedUse },
  });

  if (!user) {
    sendNotFound(res, 'User');
    return;
  }

  sendOk(res, { data: user, message: 'Account settings saved.' });
};

const handler = makeMethodsHandler({ GET: handleGet, PUT: handlePut }, true);

export default withApilytics(handler);
