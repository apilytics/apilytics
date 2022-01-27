import dayjs from 'dayjs';
import type { OpUnitType } from 'dayjs';

import { DAY, MOCK_DYNAMIC_ROUTES, MOCK_METRICS, THREE_MONTHS_DAYS } from 'utils/constants';
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
    MOCK_METRICS.map(({ path, method }) => {
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

  const endpointData = MOCK_METRICS.map(({ path, method, status_codes }) => {
    const requests = _timeFramePoints
      .filter((data) => data.path === path && data.method === method)
      .reduce((prev, curr) => prev + curr.requests, 0);

    const avg_response_time = Number((Math.floor(Math.random() * 200) + 20).toFixed());
    const avg_request_size = Number((Math.floor(Math.random() * 200) + 20).toFixed());
    const avg_response_size = Number((Math.floor(Math.random() * 200) + 20).toFixed());

    const endpoint =
      MOCK_DYNAMIC_ROUTES.find(({ pattern }) => new RegExp(pattern).test(path))?.route ?? path;

    return {
      requests,
      endpoint,
      method,
      status_codes,
      avg_response_time,
      response_time_p50: avg_response_time,
      response_time_p75: Number((avg_response_time + avg_response_time * 0.25).toFixed()),
      response_time_p90: Number((avg_response_time + avg_response_time * 0.4).toFixed()),
      response_time_p95: Number((avg_response_time + avg_response_time * 0.45).toFixed()),
      response_time_p99: Number((avg_response_time + avg_response_time * 0.49).toFixed()),
      avg_request_size,
      request_size_p50: avg_request_size,
      request_size_p75: Number((avg_request_size + avg_request_size * 0.25).toFixed()),
      request_size_p90: Number((avg_request_size + avg_request_size * 0.4).toFixed()),
      request_size_p95: Number((avg_request_size + avg_request_size * 0.45).toFixed()),
      request_size_p99: Number((avg_request_size + avg_request_size * 0.49).toFixed()),
      avg_response_size,
      response_size_p50: avg_request_size,
      response_size_p75: Number((avg_response_size + avg_response_size * 0.25).toFixed()),
      response_size_p90: Number((avg_response_size + avg_response_size * 0.4).toFixed()),
      response_size_p95: Number((avg_response_size + avg_response_size * 0.45).toFixed()),
      response_size_p99: Number((avg_response_size + avg_response_size * 0.49).toFixed()),
    };
  });

  return {
    totalRequests,
    totalRequestsGrowth,
    timeFrameData,
    endpointData,
  };
};

export const formatRequests = (requests: number): string => {
  if (requests > 1_000_000) {
    return `${(requests / 1_000_000).toFixed(1)}m`;
  }

  if (requests > 1_000) {
    return `${(requests / 1_000).toFixed(1)}k`;
  }

  return `${requests}`;
};
