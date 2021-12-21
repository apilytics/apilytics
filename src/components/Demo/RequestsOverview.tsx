import dayjs from 'dayjs';
import React from 'react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import {
  LAST_3_MONTHS_VALUE,
  LAST_6_MONTHS_VALUE,
  LAST_7_DAYS_VALUE,
  LAST_12_MONTHS_VALUE,
  LAST_30_DAYS_VALUE,
} from 'utils';
import type { RequestData, TimeFrame } from 'types';

const DAY_AND_MONTH_FORMAT = 'ddd, D MMM';
const MONTH_FORMAT = 'MMMM';

interface Props {
  timeFrame: TimeFrame;
  totalRequests: number;
  totalRequestsGrowth: number;
  requestsData: RequestData[];
}

export const RequestsOverview: React.FC<Props> = ({
  timeFrame,
  totalRequests,
  totalRequestsGrowth,
  requestsData,
}) => {
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
    <div className="bg-zinc-900 rounded-lg flex flex-col p-2 text-secondary">
      <div className="flex">
        <div className="p-4">
          <h2 className="text-xl">Total requests</h2>
          <div className="flex items-center">
            <p className="text-secondary text-lg">{totalRequests}</p>
            <p className="text-secondary text-lg text-green-400 ml-2">
              +{(totalRequestsGrowth * 100).toFixed()}%
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <ResponsiveContainer height={400}>
          <AreaChart data={requestsData}>
            <defs>
              <linearGradient id="fill-color" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              tickLine={false}
              axisLine={false}
              dataKey="date"
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
    </div>
  );
};
