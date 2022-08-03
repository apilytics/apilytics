import dayjs from 'dayjs';
import type { OpUnitType } from 'dayjs';

import {
  DEVICES,
  METHODS,
  MOCK_BROWSERS,
  MOCK_DYNAMIC_ROUTES,
  MOCK_OPERATING_SYSTEMS,
  MOCK_PATHS,
  MOCK_TOTAL_MEMORY,
  ONE_DAY,
  PERCENTILE_DATA_KEYS,
  THREE_MONTHS_DAYS,
  WEEK_DAYS,
} from 'utils/constants';
import {
  getRandomArrayItem,
  getRandomNumberBetween,
  getRandomStatusCodeForMethod,
} from 'utils/helpers';
import MOCK_COUNTRIES from 'utils/mock-countries.json';
import type { EndpointData, IntervalDays, OriginMetrics } from 'types';

export const getIntervalDaysScope = (intervalDays: IntervalDays = WEEK_DAYS): OpUnitType => {
  let scope: OpUnitType = 'day';

  if (intervalDays <= ONE_DAY) {
    scope = 'hour';
  }

  if (intervalDays >= THREE_MONTHS_DAYS) {
    scope = 'week';
  }

  return scope;
};

export const getDataPointsBetweenTimeFrame = (intervalDays: IntervalDays = WEEK_DAYS): string[] => {
  const scope = getIntervalDaysScope(intervalDays);
  const dates = [];

  let currentDateTime = dayjs().subtract(intervalDays, 'day');
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

const initialMockMetrics = MOCK_PATHS.map((path) => {
  const method = getRandomArrayItem(METHODS);
  const _country = getRandomArrayItem(MOCK_COUNTRIES);
  const country = _country.name;
  const countryCode = _country.code;
  const _region = getRandomArrayItem(_country.regions);
  const region = _region?.name ?? null;
  const city = _region ? getRandomArrayItem(_region.cities) : null;

  return {
    path,
    method,
    statusCode: getRandomStatusCodeForMethod(method),
    browser: getRandomArrayItem(MOCK_BROWSERS),
    os: getRandomArrayItem(MOCK_OPERATING_SYSTEMS),
    device: getRandomArrayItem(DEVICES),
    cpuUsage: getRandomNumberBetween(0, 100),
    memoryUsage: getRandomNumberBetween(0, 100),
    memoryTotal: MOCK_TOTAL_MEMORY,
    country,
    countryCode,
    region,
    city,
  };
});

interface MockMetricsParams {
  intervalDays?: IntervalDays;
  method?: string;
  endpoint?: string;
  statusCode?: string;
  browser?: string;
  os?: string;
  device?: string;
  country?: string;
  region?: string;
  city?: string;
}

export const getMockMetrics = ({
  intervalDays = WEEK_DAYS,
  method,
  endpoint,
  statusCode,
  browser,
  os,
  device,
  country,
  region,
  city,
}: MockMetricsParams): OriginMetrics => {
  let requestsMultiplier = 24;

  if (intervalDays <= ONE_DAY) {
    requestsMultiplier = 1;
  }

  if (intervalDays >= THREE_MONTHS_DAYS) {
    requestsMultiplier = 24 * 7;
  }

  const errorsMultiplier = requestsMultiplier * 0.1;
  const dataPoints = getDataPointsBetweenTimeFrame(intervalDays);

  let mockMetrics = initialMockMetrics;

  if (method) {
    mockMetrics = mockMetrics.filter((metric) => metric.method === method);
  }

  if (endpoint) {
    mockMetrics = mockMetrics.filter(
      (metric) => getEndpointFromPath(endpoint) === getEndpointFromPath(metric.path),
    );
  }

  if (statusCode) {
    mockMetrics = mockMetrics.filter((metric) => String(metric.statusCode) === statusCode);
  }

  if (browser) {
    mockMetrics = mockMetrics.filter((metric) => metric.browser === browser);
  }

  if (os) {
    mockMetrics = mockMetrics.filter((metric) => metric.os === os);
  }

  if (device) {
    mockMetrics = mockMetrics.filter((metric) => metric.device === device);
  }

  if (country) {
    mockMetrics = mockMetrics.filter((metric) => metric.country === country);
  }

  if (region) {
    mockMetrics = mockMetrics.filter((metric) => metric.region === region);
  }

  if (city) {
    mockMetrics = mockMetrics.filter((metric) => metric.city === city);
  }

  const _timeFramePoints = dataPoints.flatMap((time) =>
    mockMetrics.map(({ path, method }) => {
      const requests = getRandomNumberBetween(1, 5) * requestsMultiplier * dataPoints.length;
      const errors = getRandomNumberBetween(1, 5) * errorsMultiplier * dataPoints.length;

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
  const errorRate = Number((totalErrors / totalRequests || 0).toFixed(2));

  const totalRequestsGrowth = Number((Math.random() * 100).toFixed(2));
  const totalErrorsGrowth = Number((Math.random() * 100).toFixed(2));
  const errorRateGrowth = Number((Math.random() * 100).toFixed(2));

  const generalData = {
    totalRequests,
    totalRequestsGrowth,
    totalErrors,
    totalErrorsGrowth,
    errorRate,
    errorRateGrowth,
  };

  const allEndpoints: EndpointData[] = mockMetrics.map(({ path, method }) => {
    const totalRequests = _timeFramePoints
      .filter((data) => data.path === path && data.method === method)
      .reduce((prev, curr) => prev + curr.requests, 0);

    const _endpoint = endpoint ? path : getEndpointFromPath(path);
    const methodAndEndpoint = `${method} ${_endpoint}`;
    const responseTimeAvg = getRandomNumberBetween(20, 200);

    return {
      totalRequests,
      endpoint: _endpoint,
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

  const responseTimeAvg = timeFrameData.length ? getRandomNumberBetween(20, 200) : 0;
  const requestSizeAvg = timeFrameData.length ? getRandomNumberBetween(20, 200) : 0;
  const responseSizeAvg = timeFrameData.length ? getRandomNumberBetween(20, 200) : 0;
  const cpuUsageAvg = timeFrameData.length ? getRandomNumberBetween(0.2, 0.6) : 0;

  const memoryUsageAvg = timeFrameData.length
    ? getRandomNumberBetween(1_000_000, 2_000_000_000)
    : 0;

  const memoryTotalAvg = timeFrameData.length ? MOCK_TOTAL_MEMORY : 0;

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

  const cpuUsage = {
    avg: cpuUsageAvg,
    p50: cpuUsageAvg,
    p75: getRandomNumberBetween(0.6, 0.7),
    p90: getRandomNumberBetween(0.7, 0.9),
    p95: getRandomNumberBetween(0.8, 0.9),
    p99: getRandomNumberBetween(0.9, 1),
  };

  const memoryUsage = {
    avg: memoryUsageAvg,
    p50: memoryUsageAvg,
    p75: Number((memoryUsageAvg + memoryUsageAvg * 0.25).toFixed()),
    p90: Number((memoryUsageAvg + memoryUsageAvg * 0.4).toFixed()),
    p95: Number((memoryUsageAvg + memoryUsageAvg * 0.45).toFixed()),
    p99: Number((memoryUsageAvg + memoryUsageAvg * 0.49).toFixed()),
  };

  const memoryTotal = {
    avg: memoryTotalAvg,
    p50: memoryTotalAvg,
    p75: Number((memoryTotalAvg + memoryTotalAvg * 0.25).toFixed()),
    p90: Number((memoryTotalAvg + memoryTotalAvg * 0.4).toFixed()),
    p95: Number((memoryTotalAvg + memoryTotalAvg * 0.45).toFixed()),
    p99: Number((memoryTotalAvg + memoryTotalAvg * 0.49).toFixed()),
  };

  const percentileData = PERCENTILE_DATA_KEYS.map((key) => ({
    key,
    responseTime: responseTimeData[key],
    requestSize: requestSizeData[key],
    responseSize: responseSizeData[key],
    cpuUsage: cpuUsage[key],
    memoryUsage: memoryUsage[key],
    memoryTotal: memoryTotal[key],
  }));

  const uniqueStatusCodesWithCounts: Record<number, number> = {};
  const allStatusCodes = mockMetrics.flatMap(({ statusCode }) => statusCode);

  allStatusCodes.forEach((statusCode) => {
    uniqueStatusCodesWithCounts[statusCode] = (uniqueStatusCodesWithCounts[statusCode] || 0) + 1;
  });

  const statusCodeData = Object.entries(uniqueStatusCodesWithCounts).map(([statusCode, count]) => ({
    statusCode: Number(statusCode),
    requests: count * requestsMultiplier,
  }));

  const uniqueBrowsersWithCounts: Record<string, number> = {};
  const uniqueOperatingSystemsWithCounts: Record<string, number> = {};
  const uniqueDevicesWithCounts: Record<string, number> = {};

  const allBrowsers = mockMetrics.flatMap(({ browser }) => browser);
  const allOperatingSystems = mockMetrics.flatMap(({ os }) => os);
  const allDevices = mockMetrics.flatMap(({ device }) => device);

  allBrowsers.forEach((browser) => {
    uniqueBrowsersWithCounts[browser] = (uniqueBrowsersWithCounts[browser] || 0) + 1;
  });

  allOperatingSystems.forEach((os) => {
    uniqueOperatingSystemsWithCounts[os] = (uniqueOperatingSystemsWithCounts[os] || 0) + 1;
  });

  allDevices.forEach((device) => {
    uniqueDevicesWithCounts[device] = (uniqueDevicesWithCounts[device] || 0) + 1;
  });

  const browserData = Object.entries(uniqueBrowsersWithCounts).map(([browser, count]) => ({
    browser,
    requests: count * requestsMultiplier,
  }));

  const osData = Object.entries(uniqueOperatingSystemsWithCounts).map(([os, count]) => ({
    os,
    requests: count * requestsMultiplier,
  }));

  const deviceData = Object.entries(uniqueDevicesWithCounts).map(([device, count]) => ({
    device,
    requests: count * requestsMultiplier,
  }));

  const userAgentData = {
    browserData,
    osData,
    deviceData,
  };

  const uniqueCountriesWithCounts: Record<string, number> = {};
  const uniqueRegionsWithCounts: Record<string, number> = {};
  const uniqueCitiesWithCounts: Record<string, number> = {};

  const allCountries = mockMetrics.flatMap(({ country }) => country);
  const allRegions = mockMetrics.flatMap(({ region }) => region).filter(Boolean);
  const allCities = mockMetrics.flatMap(({ city }) => city).filter(Boolean);

  allCountries.forEach((country) => {
    uniqueCountriesWithCounts[country] = (uniqueCountriesWithCounts[country] || 0) + 1;
  });

  allRegions.forEach((region) => {
    uniqueRegionsWithCounts[region] = (uniqueRegionsWithCounts[region] || 0) + 1;
  });

  allCities.forEach((city) => {
    uniqueCitiesWithCounts[city as keyof typeof uniqueCitiesWithCounts] =
      (uniqueCitiesWithCounts[city as keyof typeof uniqueCitiesWithCounts] || 0) + 1;
  });

  const countryData = Object.entries(uniqueCountriesWithCounts).map(([country, count]) => ({
    country,
    countryCode: MOCK_COUNTRIES.find((c) => c.name === country)?.code ?? null,
    requests: count * requestsMultiplier,
  }));

  const regionData = Object.entries(uniqueRegionsWithCounts).map(([region, count]) => ({
    region,
    countryCode: MOCK_COUNTRIES.find((c) => c.regions.some((r) => r.name === region))?.code ?? null,
    requests: count * requestsMultiplier,
  }));

  const cityData = Object.entries(uniqueCitiesWithCounts).map(([city, count]) => ({
    city,
    countryCode:
      MOCK_COUNTRIES.find((c) => c.regions.some((c) => c.cities.some((c) => c === city)))?.code ??
      null,
    requests: count * requestsMultiplier,
  }));

  const geoLocationData = {
    countryData,
    regionData,
    cityData,
  };

  return {
    generalData,
    timeFrameData,
    endpointData,
    percentileData,
    statusCodeData,
    userAgentData,
    geoLocationData,
  };
};

export const formatCount = (count = 0, decimals = 0): string => {
  if (count > 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}m`;
  }

  if (count > 1_000) {
    return `${(count / 1_000).toFixed(1)}k`;
  }

  return `${(count ?? 0).toFixed(decimals)}`;
};

export const formatMilliseconds = (value = 0): string => {
  if (value > 1_000) {
    return `${(value / 1_000).toFixed(1)} s`;
  }

  return `${value ?? 0} ms`;
};

export const formatBytes = (value = 0): string => {
  const base = 1024;

  if (value > base ** 3) {
    return `${(value / base ** 3).toFixed(1)} GiB`;
  }

  if (value > base ** 2) {
    return `${(value / base ** 2).toFixed(1)} MiB`;
  }

  if (value > base) {
    return `${(value / base).toFixed(1)} KiB`;
  }

  return `${value ?? 0} B`;
};

export const formatCpuUsage = (value?: number): string => `${(Number(value) * 100).toFixed(1)}%`;
