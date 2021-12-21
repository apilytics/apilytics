import {
  getIdFromReq,
  getSessionUser,
  makeMethodsHandler,
  sendInvalidInput,
  sendNoContent,
  sendNotFound,
  sendOk,
  withAuthRequired,
} from 'lib-server';
import prisma from 'prismaClient';
import type {
  ApiHandler,
  SitesDetailGetResponse,
  SitesDetailPutBody,
  SitesDetailPutResponse,
} from 'types';

const handleGet: ApiHandler<SitesDetailGetResponse> = async (req, res) => {
  const user = await getSessionUser(req);
  const id = getIdFromReq(req);

  const site = await prisma.site.findFirst({ where: { id, userId: user.id } });

  if (!site) {
    sendNotFound(res, 'Site');
    return;
  }

  sendOk(res, { data: site });
};

const handlePut: ApiHandler<SitesDetailPutResponse> = async (req, res) => {
  const user = await getSessionUser(req);

  const { domain } = req.body as SitesDetailPutBody;
  if (!domain) {
    sendInvalidInput(res);
    return;
  }

  const id = getIdFromReq(req);
  const where = { id, userId: user.id };

  const [, site] = await prisma.$transaction([
    prisma.site.updateMany({ data: { domain }, where }),
    prisma.site.findFirst({ where }),
  ]);

  if (!site) {
    sendNotFound(res, 'Site');
    return;
  }

  sendOk(res, { data: site });
};

const handleDelete: ApiHandler = async (req, res) => {
  const user = await getSessionUser(req);
  const id = getIdFromReq(req);

  const { count } = await prisma.site.deleteMany({
    where: { id: id, userId: user.id },
  });

  if (count === 0) {
    sendNotFound(res, 'Site');
    return;
  }

  sendNoContent(res);
};

const handler = withAuthRequired(
  makeMethodsHandler({ GET: handleGet, PUT: handlePut, DELETE: handleDelete }),
);

export default handler;
