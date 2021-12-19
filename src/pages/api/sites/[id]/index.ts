import type { Site } from '@prisma/client';

import { getIdFromReq, getSessionUser, makeMethodsHandler } from 'lib-server/apiHelpers';
import { withAuthRequired } from 'lib-server/middleware';
import { sendInvalidInput, sendNoContent, sendNotFound, sendOk } from 'lib-server/responses';
import prisma from 'prismaClient';
import type { ApiHandler } from 'lib-server/types';

export type SitesDetailPutBody = Pick<Site, 'domain'>;

export interface SitesDetailGetResponse {
  data: Site;
}

export type SitesDetailPutResponse = SitesDetailGetResponse;

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
