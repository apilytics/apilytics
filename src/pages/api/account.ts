import { getSessionUserId, makeMethodsHandler } from 'lib-server/apiHelpers';
import { withAuthRequired } from 'lib-server/middleware';
import { sendInvalidInput, sendNoContent, sendNotFound, sendOk } from 'lib-server/responses';
import prisma from 'prismaClient';
import type {
  AccountDetailPutBody,
  AccountDetailPutResponse,
  AccountGetResponse,
  ApiHandler,
} from 'types';

const handleGet: ApiHandler<AccountGetResponse> = async (req, res) => {
  const id = await getSessionUserId(req);
  const account = await prisma.user.findUnique({ where: { id } });

  if (!account) {
    sendNotFound(res, 'Account');
    return;
  }

  sendOk(res, { data: account });
};

const handlePut: ApiHandler<AccountDetailPutResponse> = async (req, res) => {
  const id = await getSessionUserId(req);
  const { name, email } = req.body as AccountDetailPutBody;

  if (!name || !email) {
    sendInvalidInput(res);
    return;
  }

  const account = await prisma.user.update({ where: { id }, data: { name, email } });

  if (!account) {
    sendNotFound(res, 'Account');
    return;
  }

  sendOk(res, { data: account });
};

const handleDelete: ApiHandler = async (req, res) => {
  const id = await getSessionUserId(req);

  try {
    await prisma.user.delete({
      where: { id },
    });
  } catch {
    sendNotFound(res, 'Account');
    return;
  }

  sendNoContent(res);
};

const handler = withAuthRequired(
  makeMethodsHandler({ GET: handleGet, PUT: handlePut, DELETE: handleDelete }),
);

export default handler;
