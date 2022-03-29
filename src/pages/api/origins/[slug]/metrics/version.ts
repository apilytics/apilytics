import {
  getOriginForUser,
  getSessionUserId,
  getSlugFromReq,
  makeMethodsHandler,
} from 'lib-server/apiHelpers';
import { sendNotFound, sendOk } from 'lib-server/responses';
import prisma from 'prisma/client';
import { withApilytics } from 'utils/apilytics';
import type { ApiHandler, OriginMetrics } from 'types';

const handleGet: ApiHandler<{ data: Pick<OriginMetrics, 'apilyticsPackage'> }> = async (
  req,
  res,
) => {
  const userId = await getSessionUserId(req);
  const slug = getSlugFromReq(req);

  const origin = await getOriginForUser({ userId, slug });

  if (!origin) {
    sendNotFound(res, 'Origin');
    return;
  }

  const { id: originId } = origin;

  const versionData = await prisma.metric.findFirst({
    where: { originId },
    orderBy: { createdAt: 'desc' },
    select: { apilyticsVersion: true },
  });

  const [identifier, version] = versionData?.apilyticsVersion?.split(';')[0].split('/') ?? [];

  const apilyticsPackage =
    !!identifier && !!version
      ? {
          identifier,
          version,
        }
      : undefined;

  const data = {
    apilyticsPackage,
  };

  sendOk(res, { data });
};

const handler = makeMethodsHandler({ GET: handleGet }, true);

export default withApilytics(handler);
