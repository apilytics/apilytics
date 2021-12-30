import { getSessionUser, makeMethodsHandler } from 'lib-server/apiHelpers';
import { withAuthRequired } from 'lib-server/middleware';
import { sendInvalidInput, sendNoContent, sendNotFound, sendOk } from 'lib-server/responses';
import prisma from 'prismaClient';
import type {
  // AccountDetailGetResponse,
  AccountDetailPutBody,
  AccountDetailPutResponse,
  ApiHandler,
} from 'types';

// const handleGet: ApiHandler<AccountDetailGetResponse> = async (req, res) => {
//   const user = await getSessionUser(req);
//   const account = await prisma.user.findUnique({ where: { id: user.id } });

//   if (!account) {
//     sendNotFound(res, 'Account');
//     return;
//   }

//   sendOk(res, { data: account });
// };

const handlePut: ApiHandler<AccountDetailPutResponse> = async (req, res) => {
  const user = await getSessionUser(req);
  const { name, email } = req.body as AccountDetailPutBody;

  if (!name || !email) {
    sendInvalidInput(res);
    return;
  }

  const where = { id: user.id };
  const account = await prisma.user.update({ where, data: { name, email } });

  if (!account) {
    sendNotFound(res, 'Account');
    return;
  }

  sendOk(res, { data: account });
};

const handleDelete: ApiHandler = async (req, res) => {
  const user = await getSessionUser(req);

  try {
    await prisma.user.delete({
      where: { id: user.id },
    });
  } catch {
    sendNotFound(res, 'Account');
    return;
  }

  sendNoContent(res);
};

const handler = withAuthRequired(makeMethodsHandler({ PUT: handlePut, DELETE: handleDelete }));

export default handler;
