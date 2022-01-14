import type { User } from '@prisma/client';

import { getSessionUserId, makeMethodsHandler } from 'lib-server/apiHelpers';
import { withAuthRequired } from 'lib-server/middleware';
import { sendInvalidInput, sendNotFound, sendOk } from 'lib-server/responses';
import prisma from 'prisma/client';
import { withApilytics } from 'utils/apilytics';
import type { ApiHandler } from 'types';

interface AccountResponse {
  data: User;
}

const handleGet: ApiHandler<AccountResponse> = async (req, res) => {
  const id = await getSessionUserId(req);
  const account = await prisma.user.findUnique({ where: { id } });

  if (!account) {
    sendNotFound(res, 'Account');
    return;
  }

  sendOk(res, { data: account });
};

const handlePut: ApiHandler<AccountResponse> = async (req, res) => {
  const id = await getSessionUserId(req);
  const { name, email, usedTechnologies, intendedUse } = req.body;

  if (!name || !email) {
    sendInvalidInput(res);
    return;
  }

  const account = await prisma.user.update({
    where: { id },
    data: { name, email, usedTechnologies, intendedUse },
  });

  if (!account) {
    sendNotFound(res, 'Account');
    return;
  }

  sendOk(res, { data: account });
};

const handler = withAuthRequired(makeMethodsHandler({ GET: handleGet, PUT: handlePut }));

export default withApilytics(handler);
