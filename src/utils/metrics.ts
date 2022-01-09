import dayjs from 'dayjs';
import type { OpUnitType } from 'dayjs';

import { LAST_24_HOURS_VALUE, MOCK_ENDPOINTS } from 'utils/constants';
import type { OriginMetrics, TimeFrame } from 'types';

export const getTimeFrameScope = (timeFrame: TimeFrame): OpUnitType => {
  let scope: OpUnitType = 'day';

  if (timeFrame === LAST_24_HOURS_VALUE) {
    scope = 'hour';
  }

  return scope;
};

export const getDatesBetweenTimeFrame = (timeFrame: TimeFrame): string[] => {
  const scope = getTimeFrameScope(timeFrame);
  const dates = [];

  let currentDateTime = dayjs().subtract(timeFrame, 'day');
  const endDateTime = dayjs();

  while (currentDateTime <= endDateTime) {
    dates.push(dayjs(currentDateTime).startOf(scope).format());
    currentDateTime = dayjs(currentDateTime).add(1, scope);
  }

  return dates;
};

// Load mock data from JSON files and monkey patch dynamic time frame data on it.
export const getMockMetrics = (timeFrame: TimeFrame): OriginMetrics => {
  const timeFrameData = getDatesBetweenTimeFrame(timeFrame).map((time) => ({
    requests: Math.floor(Math.random() * 20) + 1,
    time,
  }));

  const totalRequests = timeFrameData.reduce((prev, curr) => prev + curr.requests, 0);
  const totalRequestsGrowth = Number(Math.random().toFixed(2));

  const routeData = MOCK_ENDPOINTS.map(({ name, methods, status_codes }) => {
    // 50 - 100 requests for each data point.
    const requests =
      Number((Math.floor(Math.random() * 100) + 75).toFixed()) * timeFrameData.length;

    // 20 - 200 ms.
    const response_time = Number((Math.floor(Math.random() * 200) + 20).toFixed());

    return {
      requests,
      name,
      methods,
      status_codes,
      response_time,
      count_green: requests * 0.39,
      count_yellow: requests * 0.33,
      count_red: requests * 0.27,
    };
  });

  return {
    totalRequests,
    totalRequestsGrowth,
    timeFrameData,
    routeData,
  };
};
