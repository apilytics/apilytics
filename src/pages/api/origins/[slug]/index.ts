import { getSessionUserId, getSlugFromReq, makeMethodsHandler } from 'lib-server/apiHelpers';
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
  const userId = await getSessionUserId(req);
  const slug = getSlugFromReq(req);

  const origin = await prisma.origin.findFirst({
    where: { slug, userId },
  });

  if (!origin) {
    sendNotFound(res, 'Origin');
    return;
  }

  sendOk(res, { data: origin });
};

const handlePut: ApiHandler<OriginsDetailPutResponse> = async (req, res) => {
  const userId = await getSessionUserId(req);
  const { name } = req.body as OriginsDetailPutBody;

  if (!name) {
    sendInvalidInput(res);
    return;
  }

  const slug = getSlugFromReq(req);

  const { count } = await prisma.origin.updateMany({
    where: { slug, userId },
    data: { name, slug },
  });

  if (count === 0) {
    sendNotFound(res, 'Origin');
    return;
  }

  const origin = await prisma.origin.findFirst({
    where: { slug, userId },
  });

  // @ts-ignore: `prisma.origin.update` returns a type that's not assignable to `Origin`.
  sendOk(res, { data: origin });
};

const handleDelete: ApiHandler = async (req, res) => {
  const userId = await getSessionUserId(req);
  const slug = getSlugFromReq(req);

  const { count } = await prisma.origin.deleteMany({
    where: { slug, userId },
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
