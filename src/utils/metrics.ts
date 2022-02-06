import dayjs from 'dayjs';
import type { OpUnitType } from 'dayjs';

import {
  DAY,
  METHODS,
  MOCK_DYNAMIC_ROUTES,
  MOCK_PATHS,
  MOCK_STATUS_CODES,
  PERCENTILE_DATA_KEYS,
  THREE_MONTHS_DAYS,
} from 'utils/constants';
import type { EndpointData, OriginMetrics, TimeFrame } from 'types';

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

// Return a dynamic route from mock data or the provided static path if a dynamic route is not found.
const getEndpointFromPath = (path: string): string =>
  MOCK_DYNAMIC_ROUTES.find(({ pattern }) =>
    new RegExp(`^${pattern.replace(/%/g, '[^/]+')}$`).test(path),
  )?.route ?? path;

const initialMockMetrics = MOCK_PATHS.map((path) => ({
  path,
  method: METHODS[Math.floor(Math.random() * METHODS.length)],
  statusCode: MOCK_STATUS_CODES[Math.floor(Math.random() * MOCK_STATUS_CODES.length)],
}));

export const getMockMetrics = ({
  timeFrame,
  method,
  endpoint,
  statusCode,
}: {
  timeFrame: TimeFrame;
  method?: string;
  endpoint?: string;
  statusCode?: string;
}): OriginMetrics => {
  let requestsMultiplier = 24;

  if (timeFrame <= DAY) {
    requestsMultiplier = 1;
  }

  if (timeFrame >= THREE_MONTHS_DAYS) {
    requestsMultiplier = 24 * 7;
  }

  const errorsMultiplier = requestsMultiplier * 0.1;
  const dataPoints = getDataPointsBetweenTimeFrame(timeFrame);

  let mockMetrics = initialMockMetrics;

  if (method && endpoint) {
    mockMetrics = mockMetrics.filter((metric) => {
      const _endpoint = getEndpointFromPath(metric.path);
      return metric.method === method && _endpoint === endpoint;
    });
  }

  if (statusCode) {
    mockMetrics = mockMetrics.filter((metric) => String(metric.statusCode) === statusCode);
  }

  const _timeFramePoints = dataPoints.flatMap((time) =>
    mockMetrics.map(({ path, method }) => {
      const requests = Number(
        ((Math.floor(Math.random() * 5) + 1) * requestsMultiplier * dataPoints.length).toFixed(),
      );

      const errors = Number(
        ((Math.floor(Math.random() * 5) + 1) * errorsMultiplier * dataPoints.length).toFixed(),
      );

      return {
        requests,
        errors,
        path,
        method,
        time,
      };
    }),
  );

  const timeFrameData = _timeFramePoints.map(({ requests, errors, time }) => ({
    requests,
    errors,
    time,
  }));

  const totalRequests = timeFrameData.reduce((prev, curr) => prev + curr.requests, 0);
  const totalErrors = timeFrameData.reduce((prev, curr) => prev + curr.errors, 0);

  const allEndpoints: EndpointData[] = mockMetrics.map(({ path, method }) => {
    const totalRequests = _timeFramePoints
      .filter((data) => data.path === path && data.method === method)
      .reduce((prev, curr) => prev + curr.requests, 0);

    const endpoint = getEndpointFromPath(path);
    const methodAndEndpoint = `${method} ${endpoint}`;
    const responseTimeAvg = Number((Math.floor(Math.random() * 200) + 20).toFixed());

    return {
      totalRequests,
      endpoint,
      method,
      methodAndEndpoint,
      responseTimeAvg,
    };
  });

  const uniqueEndpoints: Record<string, EndpointData> = {};

  allEndpoints.forEach((endpoint) => {
    const { totalRequests = 0 } = uniqueEndpoints[endpoint.methodAndEndpoint] || {};

    uniqueEndpoints[endpoint.methodAndEndpoint] = {
      ...endpoint,
      totalRequests: totalRequests + endpoint.totalRequests,
    };
  });

  const endpointData = Object.values(uniqueEndpoints);

  const responseTimeAvg = timeFrameData.length
    ? Number((Math.floor(Math.random() * 200) + 20).toFixed())
    : 0;

  const requestSizeAvg = timeFrameData.length
    ? Number((Math.floor(Math.random() * 200) + 20).toFixed())
    : 0;

  const responseSizeAvg = timeFrameData.length
    ? Number((Math.floor(Math.random() * 200) + 20).toFixed())
    : 0;

  const responseTimeData = {
    avg: responseTimeAvg,
    p50: responseTimeAvg,
    p75: Number((responseTimeAvg + responseTimeAvg * 0.25).toFixed()),
    p90: Number((responseTimeAvg + responseTimeAvg * 0.4).toFixed()),
    p95: Number((responseTimeAvg + responseTimeAvg * 0.45).toFixed()),
    p99: Number((responseTimeAvg + responseTimeAvg * 0.49).toFixed()),
  };

  const requestSizeData = {
    avg: requestSizeAvg,
    p50: requestSizeAvg,
    p75: Number((requestSizeAvg + requestSizeAvg * 0.25).toFixed()),
    p90: Number((requestSizeAvg + requestSizeAvg * 0.4).toFixed()),
    p95: Number((requestSizeAvg + requestSizeAvg * 0.45).toFixed()),
    p99: Number((requestSizeAvg + requestSizeAvg * 0.49).toFixed()),
  };

  const responseSizeData = {
    avg: responseSizeAvg,
    p50: responseSizeAvg,
    p75: Number((responseSizeAvg + responseSizeAvg * 0.25).toFixed()),
    p90: Number((responseSizeAvg + responseSizeAvg * 0.4).toFixed()),
    p95: Number((responseSizeAvg + responseSizeAvg * 0.45).toFixed()),
    p99: Number((responseSizeAvg + responseSizeAvg * 0.49).toFixed()),
  };

  const percentileData = PERCENTILE_DATA_KEYS.map((key) => ({
    key,
    responseTime: responseTimeData[key as keyof typeof responseTimeData],
    requestSize: requestSizeData[key as keyof typeof requestSizeData],
    responseSize: responseSizeData[key as keyof typeof responseSizeData],
  }));

  const uniqueStatusCodesWithCounts: Record<number, number> = {};
  const allStatusCodes = mockMetrics.flatMap(({ statusCode }) => statusCode);

  allStatusCodes.forEach((statusCode) => {
    uniqueStatusCodesWithCounts[statusCode] = (uniqueStatusCodesWithCounts[statusCode] || 0) + 1;
  });

  const statusCodeData = Object.entries(uniqueStatusCodesWithCounts).map(([statusCode, count]) => ({
    statusCode: Number(statusCode),
    count: count * requestsMultiplier,
  }));

  return {
    totalRequests,
    totalErrors,
    timeFrameData,
    endpointData,
    percentileData,
    statusCodeData,
  };
};

export const formatCount = (count: number): string => {
  if (count > 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}m`;
  }

  if (count > 1_000) {
    return `${(count / 1_000).toFixed(1)}k`;
  }

  return `${count ?? 0}`;
};
