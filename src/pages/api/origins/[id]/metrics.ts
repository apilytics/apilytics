import { getIdFromReq, getSessionUser, makeMethodsHandler } from 'lib-server/apiHelpers';
import { withAuthRequired } from 'lib-server/middleware';
import { sendCreated, sendInvalidInput, sendNotFound, sendOk } from 'lib-server/responses';
import prisma from 'prismaClient';
import type {
  ApiHandler,
  MetricsListGetResponse,
  MetricsPostBody,
  MetricsPostResponse,
} from 'types';

const handleGet: ApiHandler<MetricsListGetResponse> = async (req, res) => {
  const user = await getSessionUser(req);

  const originId = getIdFromReq(req);
  const origins = await prisma.metric.findMany({
    where: { originId, origin: { userId: user.id } },
  });
  sendOk(res, { data: origins });
};

const handlePost: ApiHandler<MetricsPostResponse> = async (req, res) => {
  const user = await getSessionUser(req);

  const originId = getIdFromReq(req);

  const { path, method, timeMillis } = req.body as MetricsPostBody;
  if (!path || !method || !timeMillis) {
    sendInvalidInput(res);
    return;
  }

  const origin = await prisma.origin.findFirst({ where: { id: originId, userId: user.id } });
  if (!origin) {
    // Either the id was invalid, or the origin with the given id didn't belong to this user.
    sendNotFound(res, 'Origin');
  }

  const metric = await prisma.metric.create({
    data: { originId, path, method, timeMillis },
  });

  sendCreated(res, { data: metric });
};

const handler = withAuthRequired(makeMethodsHandler({ GET: handleGet, POST: handlePost }));

export default handler;
