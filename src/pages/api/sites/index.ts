import { Prisma } from '@prisma/client';
import type { Site } from '@prisma/client';

import { getSessionUser, makeMethodsHandler } from 'lib-server/apiHelpers';
import { withAuthRequired } from 'lib-server/middleware';
import { sendConflict, sendCreated, sendInvalidInput, sendOk } from 'lib-server/responses';
import prisma from 'prismaClient';
import type { ApiHandler } from 'lib-server/types';

export type SitesPostBody = Pick<Site, 'domain'>;

export interface SitesListGetResponse {
  data: Site[];
}

export interface SitesPostResponse {
  data: Site;
}

const handleGet: ApiHandler<SitesListGetResponse> = async (req, res) => {
  const user = await getSessionUser(req);

  const sites = await prisma.site.findMany({ where: { userId: user.id } });
  sendOk(res, { data: sites });
};

const handlePost: ApiHandler<SitesPostResponse> = async (req, res) => {
  const user = await getSessionUser(req);

  const { domain }: SitesPostBody = req.body;
  if (!domain) {
    sendInvalidInput(res);
    return;
  }

  let site;
  try {
    site = await prisma.site.create({
      data: { userId: user.id, domain },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      sendConflict(res, 'Current user already has a site with the given domain.');
      return;
    }
    throw e;
  }

  sendCreated(res, { data: site });
};

const handler = withAuthRequired(makeMethodsHandler({ GET: handleGet, POST: handlePost }));

export default handler;
