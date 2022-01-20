import type { Metric } from '@prisma/client';

import { getSessionUserId, getSlugFromReq, makeMethodsHandler } from 'lib-server/apiHelpers';
import { withAuthRequired } from 'lib-server/middleware';
import { sendNotFound, sendOk } from 'lib-server/responses';
import prisma from 'prisma/client';
import { withApilytics } from 'utils/apilytics';
import type { ApiHandler } from 'types';

type Path = Metric['path'];

interface PathsResponse {
  data: Path[];
}

const handleGet: ApiHandler<PathsResponse> = async (req, res) => {
  const userId = await getSessionUserId(req);
  const slug = getSlugFromReq(req);

  const origin = await prisma.origin.findFirst({
    where: { slug, userId },
  });

  if (!origin) {
    sendNotFound(res, 'Origin');
    return;
  }

  const _paths: { path: Path }[] = await prisma.$queryRaw`
SELECT DISTINCT path
FROM metrics
WHERE origin_id = ${origin.id}
AND NOT EXISTS (
  SELECT
  FROM origin_routes
  WHERE metrics.origin_id = origin_routes.origin_id
    AND metrics.path ~ origin_routes.pattern
);`;

  const paths = _paths.map(({ path }) => path);

  sendOk(res, { data: paths });
};

const handler = withAuthRequired(makeMethodsHandler({ GET: handleGet }));

export default withApilytics(handler);
