import { getSessionUser, getSlugFromReq, makeMethodsHandler } from 'lib-server/apiHelpers';
import { withAuthRequired } from 'lib-server/middleware';
import { sendNotFound, sendOk } from 'lib-server/responses';
import prisma from 'prismaClient';
import type { ApiHandler, MetricsListGetResponse, RouteData, TimeFrameData } from 'types';

const handleGet: ApiHandler<MetricsListGetResponse> = async (req, res) => {
  const { id: userId } = await getSessionUser(req);
  const slug = getSlugFromReq(req);
  const { from, to } = req.query;

  if (typeof from !== 'string' || typeof to !== 'string') {
    throw new Error('Invalid time frame specified.');
  }

  const origin = await prisma.origin.findFirst({
    where: { slug, userId },
  });

  if (!origin) {
    sendNotFound(res, 'Origin');
    return;
  }

  const { id: originId } = origin;
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const fromTime = fromDate.getTime();
  const toTime = toDate.getTime();
  const timeFrame = toTime - fromTime;

  let scope = 'day';

  // Time frames less or equal than 24 hours will be grouped by hour.
  // Other time frames will be grouped by date.
  if (timeFrame <= 24 * 60 * 60 * 1000) {
    scope = 'hour';
  }

  const timeFrameData: TimeFrameData[] = await prisma.$queryRaw`
SELECT COUNT(*) AS requests, DATE_TRUNC(${scope}, metrics.created_at) AS time
FROM metrics
LEFT JOIN origins ON metrics.origin_id = origins.id
WHERE origins.id = ${originId}
  AND origins.user_id = ${userId}
  AND metrics.created_at >= ${fromDate}
  AND metrics.created_at <= ${toDate}
GROUP BY time;`;

  // Get number of requests during the last specified time frame.
  const lastTotalRequests = await prisma.metric.count({
    where: {
      origin: {
        userId,
      },
      originId,
      createdAt: {
        gte: new Date(fromTime - (toTime - fromTime)),
        lte: fromDate,
      },
    },
  });

  const totalRequests = await prisma.metric.count({
    where: {
      origin: {
        userId,
      },
      originId,
      createdAt: {
        gte: fromDate,
        lte: toDate,
      },
    },
  });

  const totalRequestsGrowth = (totalRequests / lastTotalRequests).toFixed(2);

  const routeData: RouteData[] = await prisma.$queryRaw`
SELECT
  COUNT(*) AS requests,
  filtered_metrics.path AS name,
  ARRAY_AGG(DISTINCT(filtered_metrics.method)) as methods,
  ROUND(AVG(filtered_metrics.time_millis)) as response_time,
  CARDINALITY(ARRAY_POSITIONS(ARRAY_AGG(filtered_metrics.rank), 1)) AS count_green,
  CARDINALITY(ARRAY_POSITIONS(ARRAY_AGG(filtered_metrics.rank), 2)) AS count_yellow,
  CARDINALITY(ARRAY_POSITIONS(ARRAY_AGG(filtered_metrics.rank), 3)) AS count_red
FROM (
  SELECT path, method, time_millis, NTILE(3) OVER ( ORDER BY time_millis ) AS rank
  FROM metrics
  LEFT JOIN origins ON metrics.origin_id = origins.id
  WHERE origins.id = ${originId}
    AND origins.user_id = ${userId}
    AND metrics.created_at >= ${fromDate}
    AND metrics.created_at <= ${toDate}
) AS filtered_metrics
GROUP BY filtered_metrics.path;`;

  const data = {
    totalRequests,
    totalRequestsGrowth,
    timeFrameData,
    routeData,
  };

  sendOk(res, { data });
};

const handler = withAuthRequired(makeMethodsHandler({ GET: handleGet }));

export default handler;
