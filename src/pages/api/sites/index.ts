import { Prisma } from '@prisma/client';

import {
  getSessionUser,
  makeMethodsHandler,
  sendConflict,
  sendCreated,
  sendInvalidInput,
  sendOk,
  withAuthRequired,
} from 'lib-server';
import prisma from 'prismaClient';
import type { ApiHandler, SitesListGetResponse, SitesPostBody, SitesPostResponse } from 'types';

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
