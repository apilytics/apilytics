import clsx from 'clsx';
import dayjs from 'dayjs';
import React from 'react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import type { Origin } from '@prisma/client';

import { DashboardCardContainer } from 'components/dashboard/DashboardCardContainer';
import {
  LAST_3_MONTHS_VALUE,
  LAST_6_MONTHS_VALUE,
  LAST_7_DAYS_VALUE,
  LAST_12_MONTHS_VALUE,
  LAST_24_HOURS_VALUE,
  LAST_30_DAYS_VALUE,
  TIME_FRAME_OPTIONS,
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
  const positiveGrowth = totalRequestsGrowth >= 0;

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
    <DashboardCardContainer loading={loading}>
      <div className="flex flex-col lg:flex-row">
        <div className="p-4">
          <h2 className="text-xl">Origin</h2>
          <p className="text-primary text-lg">{name}</p>
        </div>
        <div className="p-4">
          <h2 className="text-xl">Total requests</h2>
          <p className="text-lg">{(totalRequests / 100).toFixed(1)}k</p>
        </div>
        {isFinite(totalRequestsGrowth) && (
          <div className="p-4">
            <h2 className="text-xl">
              From previous {TIME_FRAME_OPTIONS[timeFrame].split('Last ')[1]}
            </h2>
            <p className={clsx('text-lg', positiveGrowth ? 'text-success' : 'text-error')}>
              {positiveGrowth ? '+' : ''}
              {(totalRequestsGrowth * 100).toFixed()}%
            </p>
          </div>
        )}
      </div>
      <div className="mt-4">
        <ResponsiveContainer height={400}>
          <AreaChart data={timeFrameData}>
            <defs>
              <linearGradient id="fill-color" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="btn-var(--primary)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="btn-var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              tickLine={false}
              axisLine={false}
              dataKey="time"
              tickFormatter={tickFormatter}
              interval="preserveStart"
              stroke="var(--base-content)"
              padding={{ left: 20, right: 20 }}
            />
            <YAxis
              width={40}
              tickLine={false}
              axisLine={false}
              stroke="var(--base-content)"
              padding={{ top: 20, bottom: 20 }}
            />
            <Area type="monotone" dataKey="requests" fill="url(#fill-color)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DashboardCardContainer>
  );
};
