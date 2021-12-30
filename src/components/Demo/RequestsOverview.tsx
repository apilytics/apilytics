import dayjs from 'dayjs';
import React from 'react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import type { Origin } from '@prisma/client';

import { LoadingIndicator } from 'components/shared/LoadingIndicator';
import {
  LAST_3_MONTHS_VALUE,
  LAST_6_MONTHS_VALUE,
  LAST_7_DAYS_VALUE,
  LAST_12_MONTHS_VALUE,
  LAST_24_HOURS_VALUE,
  LAST_30_DAYS_VALUE,
} from 'utils/constants';
import type { OriginMetrics, TimeFrame } from 'types';

const HOUR_FORMAT = 'h A';
const DAY_AND_MONTH_FORMAT = 'ddd, D MMM';
const MONTH_FORMAT = 'MMMM';

interface Props {
  timeFrame: TimeFrame;
  origin: Origin;
  metrics: OriginMetrics;
  loading: boolean;
}

export const RequestsOverview: React.FC<Props> = ({
  timeFrame,
  origin: { name },
  metrics: { totalRequests, totalRequestsGrowth, timeFrameData },
  loading,
}) => {
  const positiveGrowth = Number(totalRequestsGrowth) >= 0;

  const tickFormatter = (date: string, index: number): string => {
    switch (timeFrame) {
      // Display label for every fourth hour.
      case LAST_24_HOURS_VALUE: {
        if (index % 5 === 0) {
          return dayjs(date).format(HOUR_FORMAT);
        } else {
          return '';
        }
      }

      // Display label for every day.
      case LAST_7_DAYS_VALUE: {
        return dayjs(date).format(DAY_AND_MONTH_FORMAT);
      }

      // Display label for every fifth day.
      case LAST_30_DAYS_VALUE: {
        if (index % 5 === 0) {
          return dayjs(date).format(DAY_AND_MONTH_FORMAT);
        } else {
          return '';
        }
      }

      // Display label for every second week.
      case LAST_3_MONTHS_VALUE: {
        if (index % 14 === 0) {
          return dayjs(date).format(DAY_AND_MONTH_FORMAT);
        } else {
          return '';
        }
      }

      // Display label for every month.
      case LAST_6_MONTHS_VALUE: {
        if (index % 30 === 0) {
          return dayjs(date).format(MONTH_FORMAT);
        } else {
          return '';
        }
      }

      // Display label for every second month.
      case LAST_12_MONTHS_VALUE: {
        if (index % 30 === 0) {
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
    <div className="bg-zinc-900 rounded-lg flex flex-col p-2 text-secondary grow">
      {loading ? (
        <div className="grow flex justify-center items-center">
          <LoadingIndicator />
        </div>
      ) : (
        <>
          <div className="flex">
            <div className="p-4">
              <h2 className="text-secondary text-xl">API</h2>
              <p className="text-primary text-lg">{name}</p>
            </div>
            <div className="p-4">
              <h2 className="text-xl">Total requests</h2>
              <div className="flex items-center">
                <p className="text-secondary text-lg">{(totalRequests / 100).toFixed(1)}k</p>
                <p
                  className={`text-secondary text-lg ${
                    positiveGrowth ? 'text-green-400' : 'text-red-400'
                  } ml-2`}
                >
                  {positiveGrowth ? '+' : ''}
                  {(Number(totalRequestsGrowth) * 100).toFixed()}%
                </p>
              </div>
            </div>
            <div className="p-4 ml-auto">
              <h2 className="text-xl">Beta</h2>
            </div>
          </div>
          <div className="mt-4">
            <ResponsiveContainer height={400}>
              <AreaChart data={timeFrameData}>
                <defs>
                  <linearGradient id="fill-color" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  tickLine={false}
                  axisLine={false}
                  dataKey="time"
                  tickFormatter={tickFormatter}
                  interval="preserveStart"
                  stroke="var(--color-secondary)"
                  padding={{ left: 20, right: 20 }}
                />
                <YAxis
                  width={40}
                  tickLine={false}
                  axisLine={false}
                  stroke="var(--color-secondary)"
                  padding={{ top: 20, bottom: 20 }}
                />
                <Area type="monotone" dataKey="requests" fill="url(#fill-color)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};
