import { Prisma } from '@prisma/client';

import { makeMethodsHandler } from 'lib-server/apiHelpers';
import { sendConflict, sendCreated, sendInvalidInput } from 'lib-server/responses';
import prisma from 'prismaClient';
import type { ApiHandler, SignUpBody } from 'types';

const EMAIL_REGEX = /^.+@.+$/;

const handlePost: ApiHandler = async (req, res): Promise<void> => {
  const { email, role, useCases, howThisCouldHelp }: SignUpBody = req.body;

  if (!email || !role) {
    sendInvalidInput(res);
    return;
  }

  if (!email.match(EMAIL_REGEX)) {
    sendInvalidInput(res);
    return;
  }

  try {
    await prisma.waitlistUser.create({ data: { email, role, useCases, howThisCouldHelp } });
  } catch (e) {
    // https://www.prisma.io/docs/concepts/components/prisma-client/handling-exceptions-and-errors
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      sendConflict(res, 'This email had already been added to the waitlist.');
      return;
    }

    throw e;
  }

  sendCreated(res, { message: 'Successfully added to the waitlist.' });
};

const handler = makeMethodsHandler({ POST: handlePost });

export default handler;
