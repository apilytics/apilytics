import { Prisma } from '@prisma/client';

import { makeMethodsHandler } from 'lib-server/apiHelpers';
import { sendConflict, sendCreated, sendInvalidInput } from 'lib-server/responses';
import prisma from 'prismaClient';
import { withApilytics } from 'utils/apilytics';
import type { ApiHandler } from 'types';

interface EmailListPostResponse {
  message: string;
}

const handlePost: ApiHandler<EmailListPostResponse> = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    sendInvalidInput(res);
    return;
  }

  try {
    await prisma.emailListEntry.create({
      data: { email },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      sendConflict(res, 'This email has already been added.');
      return;
    }

    throw e;
  }

  sendCreated(res, { message: 'Email added to the list.' });
};

const handler = makeMethodsHandler({ POST: handlePost });

export default withApilytics(handler);
