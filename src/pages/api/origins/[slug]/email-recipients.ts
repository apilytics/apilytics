import {
  getOriginForUser,
  getSessionUserId,
  getSlugFromReq,
  hasWritePermissionsForOrigin,
  makeMethodsHandler,
} from 'lib-server/apiHelpers';
import {
  sendConflict,
  sendInvalidInput,
  sendNotFound,
  sendOk,
  sendUnauthorized,
} from 'lib-server/responses';
import prisma from 'prisma/client';
import { isUniqueConstraintFailed } from 'prisma/errors';
import { withApilytics } from 'utils/apilytics';
import { PERMISSION_ERROR } from 'utils/constants';
import type { ApiHandler } from 'types';

const getEmails = async (originId: string): Promise<string[]> => {
  const recipients = await prisma.weeklyEmailReportRecipient.findMany({
    where: { originId },
    select: { email: true },
  });

  return recipients.map(({ email }) => email);
};

const handleGet: ApiHandler<{ data: string[] }> = async (req, res) => {
  const userId = await getSessionUserId(req);
  const slug = getSlugFromReq(req);
  const origin = await getOriginForUser({ userId, slug });

  if (!origin) {
    sendNotFound(res, 'Origin');
    return;
  }

  const emails = await getEmails(origin.id);
  sendOk(res, { data: emails });
};

const handlePut: ApiHandler<{ data: string[] }> = async (req, res) => {
  const userId = await getSessionUserId(req);
  const slug = getSlugFromReq(req);

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

  const origin = await getOriginForUser({ userId, slug });

  if (!origin) {
    sendNotFound(res, 'Origin');
    return;
  }

  const { id: originId } = origin;
  const body: string[] = req.body;

  if (new Set(body).size !== body.length) {
    sendInvalidInput(res, 'The emails contain duplicate values.');
    return;
  }

  const data = body.map((email) => ({
    originId,
    email,
  }));

  try {
    await prisma.$transaction([
      prisma.weeklyEmailReportRecipient.deleteMany({ where: { originId } }),
      prisma.weeklyEmailReportRecipient.createMany({ data }),
    ]);
  } catch (e) {
    if (isUniqueConstraintFailed(e)) {
      sendConflict(res, 'Two or more emails map to conflicting patterns.');
      return;
    }

    throw e;
  }

  const emails = await getEmails(originId);
  sendOk(res, { data: emails, message: 'Recipients updated.' });
};

const handler = makeMethodsHandler({ GET: handleGet, PUT: handlePut }, true);

export default withApilytics(handler);
