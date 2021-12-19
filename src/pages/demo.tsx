import dayjs from 'dayjs';
import React, { useState } from 'react';
import type { NextPage } from 'next';

import {
  DashboardOptions,
  Layout,
  RequestsOverview,
  ResponseTimes,
  RouteMetrics,
} from 'components';
import {
  LAST_3_MONTHS_VALUE,
  LAST_6_MONTHS_VALUE,
  LAST_7_DAYS_VALUE,
  LAST_12_MONTHS_VALUE,
  LAST_30_DAYS_VALUE,
  Method,
} from 'utils';
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

const api = (timeFrame: TimeFrame): APIResponse => {
  const requestsData = mockRequestsData[timeFrame];
  const totalRequests = requestsData.reduce((acc, { requests }) => acc + requests, 0);

  const totalRequestsGrowth = Number(
    (
      (requestsData[requestsData.length - 1].requests - requestsData[0].requests) /
      requestsData[requestsData.length - 1].requests
    ).toFixed(2),
  );

  const requestsPerSession = Number((Math.max(Math.random(), 0.5) * 10).toFixed());
  const requestsPerSessionGrowth = Number(Math.random().toFixed(2));

  return {
    sources: MOCK_REQUEST_SOURCES.map((name) => ({
      name,
      totalRequests,
      totalRequestsGrowth,
      requestsPerSession,
      requestsPerSessionGrowth,
      requestsData,
      routesData: MOCK_ROUTES_DATA,
    })),
  };
};

const Demo: NextPage = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>(LAST_7_DAYS_VALUE);
  const { sources = [] } = api(timeFrame);
  const [sourceName, setSourceName] = useState(sources[0].name);

  const {
    totalRequests = 0,
    totalRequestsGrowth = 0,
    requestsPerSession = 0,
    requestsPerSessionGrowth = 0,
    requestsData = [],
    routesData = [],
  } = sources.find((source) => source.name === sourceName) || {};

  return (
    <Layout noIndex headerMaxWidth="5xl">
      <div className="bg-background bg-no-repeat bg-cover">
        <div className="bg-filter">
          <div className="container max-w-5xl py-16 animate-fade-in-top animation-delay-400">
            <DashboardOptions
              sourceName={sourceName}
              setSourceName={setSourceName}
              sources={sources}
              timeFrame={timeFrame}
              setTimeFrame={setTimeFrame}
            />
            <RequestsOverview
              timeFrame={timeFrame}
              totalRequests={totalRequests}
              totalRequestsGrowth={totalRequestsGrowth}
              requestsPerSession={requestsPerSession}
              requestsPerSessionGrowth={requestsPerSessionGrowth}
              requestsData={requestsData}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <RouteMetrics routesData={routesData} />
              <ResponseTimes routesData={routesData} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Demo;
