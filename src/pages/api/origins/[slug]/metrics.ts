import { getSessionUserId, getSlugFromReq, makeMethodsHandler } from 'lib-server/apiHelpers';
import { withAuthRequired } from 'lib-server/middleware';
import { sendNotFound, sendOk } from 'lib-server/responses';
import prisma from 'prisma/client';
import { withApilytics } from 'utils/apilytics';
import type { ApiHandler, OriginMetrics, RouteData, TimeFrameData } from 'types';

const DAY_MILLIS = 24 * 60 * 60 * 1000;
const THREE_MONTHS_MILLIS = 3 * 30 * DAY_MILLIS;

interface GetResponse {
  data: OriginMetrics;
}

const handleGet: ApiHandler<GetResponse> = async (req, res) => {
  const userId = await getSessionUserId(req);
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

  // The scope indicates which time unit the metrics are grouped by.
  let scope = 'day';

  if (timeFrame <= DAY_MILLIS) {
    scope = 'hour';
  } else if (timeFrame >= THREE_MONTHS_MILLIS) {
    scope = 'week';
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

  const totalRequestsGrowth = Number((totalRequests / lastTotalRequests).toFixed(2));

  const routeData: RouteData[] = await prisma.$queryRaw`
SELECT
  COUNT(*) AS requests,
  filtered_metrics.path AS name,
  ARRAY_AGG(DISTINCT(filtered_metrics.method)) as methods,
  ARRAY_AGG(DISTINCT(filtered_metrics.status_code)) as status_codes,
  ROUND(AVG(filtered_metrics.time_millis)) as response_time,
  CARDINALITY(ARRAY_POSITIONS(ARRAY_AGG(filtered_metrics.rank), 1)) AS count_green,
  CARDINALITY(ARRAY_POSITIONS(ARRAY_AGG(filtered_metrics.rank), 2)) AS count_yellow,
  CARDINALITY(ARRAY_POSITIONS(ARRAY_AGG(filtered_metrics.rank), 3)) AS count_red
FROM (
  SELECT path, method, status_code, time_millis, NTILE(3) OVER ( ORDER BY time_millis ) AS rank
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

export default withApilytics(handler);
