import dayjs from 'dayjs';

import {
  LAST_3_MONTHS_VALUE,
  LAST_6_MONTHS_VALUE,
  LAST_7_DAYS_VALUE,
  LAST_12_MONTHS_VALUE,
  LAST_30_DAYS_VALUE,
  Method,
} from 'utils/constants';
import type { RequestData, RequestSource, TimeFrame } from 'types';

const MOCK_ROUTES_DATA = [
  {
    name: '/profile',
    requests: 120200,
    methods: [Method.GET],
    responseTime: 22,
    responseGreen: 0.39,
    responseYellow: 0.33,
    responseRed: 0.27,
  },
  {
    name: '/users',
    requests: 100400,
    methods: [Method.GET],
    responseTime: 32,
    responseGreen: 0.38,
    responseYellow: 0.33,
    responseRed: 0.29,
  },
  {
    name: '/posts',
    requests: 82600,
    methods: [Method.GET],
    responseTime: 36,
    responseGreen: 0.36,
    responseYellow: 0.33,
    responseRed: 0.31,
  },
  {
    name: '/posts/:id',
    requests: 74400,
    methods: [Method.GET],
    responseTime: 42,
    responseGreen: 0.33,
    responseYellow: 0.33,
    responseRed: 0.34,
  },
  {
    name: '/users/:id',
    requests: 68200,
    methods: [Method.GET],
    responseTime: 50,
    responseGreen: 0.34,
    responseYellow: 0.33,
    responseRed: 0.33,
  },
  {
    name: '/login',
    requests: 54700,
    methods: [Method.POST],
    responseTime: 52,
    responseGreen: 0.35,
    responseYellow: 0.33,
    responseRed: 0.32,
  },
  {
    name: '/register',
    requests: 40300,
    methods: [Method.POST],
    responseTime: 60,
    responseGreen: 0.33,
    responseYellow: 0.33,
    responseRed: 0.34,
  },
  {
    name: '/posts/new',
    requests: 21700,
    methods: [Method.POST],
    responseTime: 80,
    responseGreen: 0.37,
    responseYellow: 0.33,
    responseRed: 0.3,
  },
  {
    name: 'others',
    requests: 9500,
    methods: [Method.GET, Method.POST, Method.PUT, Method.PATCH],
    responseTime: 82,
    responseGreen: 0.33,
    responseYellow: 0.33,
    responseRed: 0.34,
  },
];

interface APIResponse {
  sources: RequestSource[];
}

type RequestDataScope = 'day' | 'week' | 'month';

const requestScopeToMultiplier = {
  day: 1,
  week: 7,
  month: 30,
};

const generateMockRequestsData = ({
  length,
  scope,
}: {
  length: number;
  scope: RequestDataScope;
}): RequestData[] => {
  const multiplier = requestScopeToMultiplier[scope] + 5;

  return Array(length)
    .fill(null)
    .map((_, i) => ({
      date: dayjs().subtract(i, scope).format('YYYY-MM-DD'),
      requests: Number((length * multiplier - Math.random() * multiplier * i).toFixed()),
    }))
    .reverse();
};

const MOCK_REQUEST_SOURCES = [
  'All sources',
  'www.apilytics.io',
  'Internal REST API',
  'CLI Middleware',
];

const mockRequestsData = {
  [LAST_7_DAYS_VALUE]: generateMockRequestsData({ length: 7, scope: 'day' }),
  [LAST_30_DAYS_VALUE]: generateMockRequestsData({ length: 30, scope: 'day' }),
  [LAST_3_MONTHS_VALUE]: generateMockRequestsData({ length: 12, scope: 'week' }),
  [LAST_6_MONTHS_VALUE]: generateMockRequestsData({ length: 24, scope: 'week' }),
  [LAST_12_MONTHS_VALUE]: generateMockRequestsData({ length: 12, scope: 'month' }),
};

export const mockApi = (timeFrame: TimeFrame): APIResponse => {
  const requestsData = mockRequestsData[timeFrame];
  const totalRequests = requestsData.reduce((acc, { requests }) => acc + requests, 0);

  const totalRequestsGrowth = Number(
    (
      (requestsData[requestsData.length - 1].requests - requestsData[0].requests) /
      requestsData[requestsData.length - 1].requests
    ).toFixed(2),
  );

  return {
    sources: MOCK_REQUEST_SOURCES.map((name) => ({
      name,
      totalRequests,
      totalRequestsGrowth,
      requestsData,
      routesData: MOCK_ROUTES_DATA,
    })),
  };
};
