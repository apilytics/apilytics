import { getIdFromReq, getSessionUser, makeMethodsHandler } from 'lib-server/apiHelpers';
import { withAuthRequired } from 'lib-server/middleware';
import { sendOk } from 'lib-server/responses';
import prisma from 'prismaClient';
import type { ApiHandler, MetricsListGetResponse } from 'types';

const handleGet: ApiHandler<MetricsListGetResponse> = async (req, res) => {
  const user = await getSessionUser(req);

  const originId = getIdFromReq(req);
  const origins = await prisma.metric.findMany({
    where: { originId, origin: { userId: user.id } },
  });
  sendOk(res, { data: origins });
};

const handler = withAuthRequired(makeMethodsHandler({ GET: handleGet }));

export default handler;
