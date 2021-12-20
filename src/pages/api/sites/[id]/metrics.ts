import type { Metric } from '@prisma/client';

import { getIdFromReq, getSessionUser, makeMethodsHandler } from 'lib-server/apiHelpers';
import { withAuthRequired } from 'lib-server/middleware';
import { sendCreated, sendInvalidInput, sendNotFound, sendOk } from 'lib-server/responses';
import prisma from 'prismaClient';
import type { ApiHandler } from 'lib-server/types';

export type MetricsPostBody = Pick<Metric, 'path' | 'method' | 'timeMillis'>;

export interface MetricsListGetResponse {
  data: Metric[];
}

export interface MetricsPostResponse {
  data: Metric;
}

const handleGet: ApiHandler<MetricsListGetResponse> = async (req, res) => {
  const user = await getSessionUser(req);

  const siteId = getIdFromReq(req);
  const sites = await prisma.metric.findMany({ where: { siteId, site: { userId: user.id } } });
  sendOk(res, { data: sites });
};

const handlePost: ApiHandler<MetricsPostResponse> = async (req, res) => {
  const user = await getSessionUser(req);

  const siteId = getIdFromReq(req);

  const { path, method, timeMillis } = req.body as MetricsPostBody;
  if (!path || !method || !timeMillis) {
    sendInvalidInput(res);
    return;
  }

  const site = await prisma.site.findFirst({ where: { id: siteId, userId: user.id } });
  if (!site) {
    // Either the id was invalid, or the site with the given id didn't belong to this user.
    sendNotFound(res, 'Site');
  }

  const metric = await prisma.metric.create({
    data: { siteId, path, method, timeMillis },
  });

  sendCreated(res, { data: metric });
};

const handler = withAuthRequired(makeMethodsHandler({ GET: handleGet, POST: handlePost }));

export default handler;
