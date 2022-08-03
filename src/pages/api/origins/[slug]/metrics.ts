import {
  generateMetrics,
  getOriginForUser,
  getSessionUserId,
  getSlugFromReq,
  makeMethodsHandler,
} from 'lib-server/apiHelpers';
import { sendInvalidInput, sendNotFound, sendOk } from 'lib-server/responses';
import { withApilytics } from 'utils/apilytics';
import { WEEK_DAYS } from 'utils/constants';
import { isValidIntervalDays } from 'utils/helpers';
import type { ApiHandler, OriginMetrics } from 'types';

const handleGet: ApiHandler<{ data: OriginMetrics }> = async (req, res) => {
  const { query } = req;
  const intervalDays = Number(query['interval-days']) || WEEK_DAYS;
  const statusCode = query['status-code'];

  if (statusCode && typeof statusCode !== 'string') {
    sendInvalidInput(res, 'Invalid status code:' + statusCode);
    return;
  }

  if (!isValidIntervalDays(intervalDays)) {
    sendInvalidInput(res, 'Invalid interval of days:' + intervalDays);
    return;
  }

  const filters = { intervalDays, statusCode, ...query };
  const userId = await getSessionUserId(req);
  const slug = getSlugFromReq(req);
  const origin = await getOriginForUser({ userId, slug });

  if (!origin) {
    sendNotFound(res, 'Origin');
    return;
  }

  const data = await generateMetrics({ origin, filters });
  sendOk(res, { data });
};

const handler = makeMethodsHandler({ GET: handleGet }, true);

export default withApilytics(handler);
