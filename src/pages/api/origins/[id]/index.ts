import { getIdFromReq, getSessionUser, makeMethodsHandler } from 'lib-server/apiHelpers';
import { withAuthRequired } from 'lib-server/middleware';
import { sendInvalidInput, sendNoContent, sendNotFound, sendOk } from 'lib-server/responses';
import prisma from 'prismaClient';
import type {
  ApiHandler,
  OriginsDetailGetResponse,
  OriginsDetailPutBody,
  OriginsDetailPutResponse,
} from 'types';

const handleGet: ApiHandler<OriginsDetailGetResponse> = async (req, res) => {
  const user = await getSessionUser(req);
  const id = getIdFromReq(req);

  const origin = await prisma.origin.findFirst({ where: { id, userId: user.id } });

  if (!origin) {
    sendNotFound(res, 'Origin');
    return;
  }

  sendOk(res, { data: origin });
};

const handlePut: ApiHandler<OriginsDetailPutResponse> = async (req, res) => {
  const user = await getSessionUser(req);

  const { domain } = req.body as OriginsDetailPutBody;
  if (!domain) {
    sendInvalidInput(res);
    return;
  }

  const id = getIdFromReq(req);
  const where = { id, userId: user.id };

  const [, origin] = await prisma.$transaction([
    prisma.origin.updateMany({ data: { domain }, where }),
    prisma.origin.findFirst({ where }),
  ]);

  if (!origin) {
    sendNotFound(res, 'Origin');
    return;
  }

  sendOk(res, { data: origin });
};

const handleDelete: ApiHandler = async (req, res) => {
  const user = await getSessionUser(req);
  const id = getIdFromReq(req);

  const { count } = await prisma.origin.deleteMany({
    where: { id, userId: user.id },
  });

  if (count === 0) {
    sendNotFound(res, 'Origin');
    return;
  }

  sendNoContent(res);
};

const handler = withAuthRequired(
  makeMethodsHandler({ GET: handleGet, PUT: handlePut, DELETE: handleDelete }),
);

export default handler;
