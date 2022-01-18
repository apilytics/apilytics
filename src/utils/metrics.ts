import dayjs from 'dayjs';
import type { OpUnitType } from 'dayjs';

import { DAY, MOCK_ENDPOINTS, THREE_MONTHS_DAYS } from 'utils/constants';
import type { OriginMetrics, TimeFrame } from 'types';

export const getTimeFrameScope = (timeFrame: TimeFrame): OpUnitType => {
  let scope: OpUnitType = 'day';

  if (timeFrame <= DAY) {
    scope = 'hour';
  }

  if (timeFrame >= THREE_MONTHS_DAYS) {
    scope = 'week';
  }

  return scope;
};

export const getDataPointsBetweenTimeFrame = (timeFrame: TimeFrame): string[] => {
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
  let requestsMultiplier = 24;

  if (timeFrame <= DAY) {
    requestsMultiplier = 1;
  }

  if (timeFrame >= THREE_MONTHS_DAYS) {
    requestsMultiplier = 24 * 7;
  }

  const dataPoints = getDataPointsBetweenTimeFrame(timeFrame);

  const _timeFramePoints = dataPoints.flatMap((time) =>
    MOCK_ENDPOINTS.map(({ path, method }) => {
      // 1 - 5 requests for each endpoint per each data point.
      const requests = Number(
        ((Math.floor(Math.random() * 5) + 1) * requestsMultiplier * dataPoints.length).toFixed(),
      );

      return {
        requests,
        path,
        method,
        time,
      };
    }),
  );

  const timeFrameData = _timeFramePoints.map(({ requests, time }) => ({ requests, time }));
  const totalRequests = timeFrameData.reduce((prev, curr) => prev + curr.requests, 0);
  const totalRequestsGrowth = Number(Math.random().toFixed(2));

  const routeData = MOCK_ENDPOINTS.map(({ path, method, status_codes }) => {
    const requests = _timeFramePoints
      .filter((data) => data.path === path && data.method === method)
      .reduce((prev, curr) => prev + curr.requests, 0);

    const response_time = Number((Math.floor(Math.random() * 200) + 20).toFixed());

    const green_multiplier = Number((Math.random() * (0.4 - 0.2) + 0.2).toFixed(2));
    const yellow_multiplier = Number((Math.random() * (0.4 - 0.2) + 0.2).toFixed(2));
    const red_multiplier = Number((1 - green_multiplier - yellow_multiplier).toFixed(2));

    const count_green = Number((green_multiplier * requests).toFixed());
    const count_yellow = Number((yellow_multiplier * requests).toFixed());
    const count_red = Number((red_multiplier * requests).toFixed());

    return {
      requests,
      path,
      method,
      status_codes,
      response_time,
      count_green,
      count_yellow,
      count_red,
    };
  });

  return {
    totalRequests,
    totalRequestsGrowth,
    timeFrameData,
    routeData,
  };
};
