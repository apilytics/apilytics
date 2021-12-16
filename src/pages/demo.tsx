import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import type { NextPage } from 'next';

import { Layout, Select } from 'components';

const LAST_7_DAYS_LABEL = 'Last 7 days';
const LAST_30_DAYS_LABEL = 'Last 30 days';
const LAST_3_MONTHS_LABEL = 'Last 3 months';
const LAST_6_MONTHS_LABEL = 'Last 6 months';
const LAST_12_MONTHS_LABEL = 'Last 12 months';

const LAST_7_DAYS_VALUE = 7;
const LAST_30_DAYS_VALUE = 30;
const LAST_3_MONTHS_VALUE = 90;
const LAST_6_MONTHS_VALUE = 180;
const LAST_12_MONTHS_VALUE = 365;

const TIME_FRAME_OPTIONS = {
  [LAST_7_DAYS_LABEL]: LAST_7_DAYS_VALUE,
  [LAST_30_DAYS_LABEL]: LAST_30_DAYS_VALUE,
  [LAST_3_MONTHS_LABEL]: LAST_3_MONTHS_VALUE,
  [LAST_6_MONTHS_LABEL]: LAST_6_MONTHS_VALUE,
  [LAST_12_MONTHS_LABEL]: LAST_12_MONTHS_VALUE,
};

const DAY_AND_MONTH_FORMAT = 'ddd, D MMM';
const MONTH_FORMAT = 'MMMM';

interface RequestData {
  date: string;
  requests: number;
}

interface RequestSource {
  name: string;
  requests: number;
  requestsGrowth: number;
  requestsPerSession: number;
  requestsPerSessionGrowth: number;
  data: RequestData[];
}

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

type TimeFrame = keyof typeof mockRequestsData;

const api = (timeFrame: TimeFrame): APIResponse => {
  const data = mockRequestsData[timeFrame];
  const requests = data.reduce((acc, { requests }) => acc + requests, 0);

  const requestsGrowth = Number(
    ((data[data.length - 1].requests - data[0].requests) / data[data.length - 1].requests).toFixed(
      2,
    ),
  );

  const requestsPerSession = Number((Math.max(Math.random(), 0.5) * 10).toFixed());
  const requestsPerSessionGrowth = Number(Math.random().toFixed(2));

  return {
    sources: MOCK_REQUEST_SOURCES.map((name) => ({
      name,
      requests,
      requestsGrowth,
      requestsPerSession,
      requestsPerSessionGrowth,
      data,
    })),
  };
};

const Demo: NextPage = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>(LAST_7_DAYS_VALUE);
  const { sources = [] } = api(timeFrame);
  const [sourceName, setSourceName] = useState(sources[0].name);
  const source = sources.find((source) => source.name === sourceName);

  const tickFormatter = (date: string, index: number): string => {
    switch (timeFrame) {
      case LAST_7_DAYS_VALUE: {
        return dayjs(date).format(DAY_AND_MONTH_FORMAT);
      }

      case LAST_30_DAYS_VALUE: {
        // Every fifth day of the month.
        if (index % 5 === 0) {
          return dayjs(date).format(DAY_AND_MONTH_FORMAT);
        } else {
          return '';
        }
      }

      case LAST_3_MONTHS_VALUE: {
        return dayjs(date).format(DAY_AND_MONTH_FORMAT);
      }

      case LAST_6_MONTHS_VALUE: {
        // Every fourth week of the year.
        if (index % 4 === 0) {
          return dayjs(date).format(MONTH_FORMAT);
        } else {
          return '';
        }
      }

      case LAST_12_MONTHS_VALUE: {
        // Every other month of the year.
        if (index % 2 === 0) {
          return dayjs(date).format(MONTH_FORMAT);
        } else {
          return '';
        }
      }

      default: {
        return '';
      }
    }
  };

  return (
    <Layout noIndex headerMaxWidth="5xl">
      <div className="bg-background bg-no-repeat bg-cover">
        <div className="bg-filter">
          <div className="container max-w-5xl py-16 animate-fade-in-top animation-delay-400">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h1 className="text-white text-2xl">apilytics.io</h1>
                <Select
                  value={sourceName}
                  onChange={({ target }): void => setSourceName(target.value)}
                  containerProps={{ className: 'ml-4' }}
                >
                  {sources.map(({ name }) => (
                    <option value={name} key={name}>
                      {name}
                    </option>
                  ))}
                </Select>
              </div>
              <Select
                value={timeFrame}
                onChange={({ target }): void => setTimeFrame(Number(target.value) as TimeFrame)}
              >
                {Object.entries(TIME_FRAME_OPTIONS).map(([label, value]) => (
                  <option value={value} key={label}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="bg-white border-primary rounded-lg flex flex-col p-4">
              <div className="flex divide-x">
                <div className="p-4">
                  <h2 className="text-xl">Requests</h2>
                  <div className="flex items-center">
                    {source && (
                      <>
                        <p className="text-secondary text-lg">{source.requests}</p>
                        <p className="text-secondary text-lg text-green-400 ml-2">
                          +{(source.requestsGrowth * 100).toFixed()}%
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-xl">Avg. requests per session</h2>
                  <div className="flex items-center">
                    {source && (
                      <>
                        <p className="text-secondary text-lg">{source.requestsPerSession}</p>
                        <p className="text-secondary text-lg text-green-400 ml-2">
                          +{(source.requestsPerSessionGrowth * 100).toFixed()}%
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                {source && (
                  <ResponsiveContainer height={400}>
                    <AreaChart data={source.data}>
                      <defs>
                        <linearGradient id="fill-color" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        tickLine={false}
                        dataKey="date"
                        tickFormatter={tickFormatter}
                        interval="preserveStart"
                      />
                      <YAxis width={40} tickLine={false} />
                      <Area type="monotone" dataKey="requests" fill="url(#fill-color)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Demo;
