import clsx from 'clsx';
import dayjs from 'dayjs';
import React from 'react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import type { Origin } from '@prisma/client';

import { DashboardCardContainer } from 'components/dashboard/DashboardCardContainer';
import {
  DAY,
  MONTH_DAYS,
  SIX_MONTHS_DAYS,
  THREE_MONTHS_DAYS,
  TIME_FRAME_OPTIONS,
  WEEK_DAYS,
  YEAR_DAYS,
} from 'utils/constants';
import { getDataPointsBetweenTimeFrame, getTimeFrameScope } from 'utils/metrics';
import type { OriginMetrics, TimeFrame, TimeFrameData } from 'types';

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
  const scope = getTimeFrameScope(timeFrame);

  // Make sure the data contains points in time for the whole specified time frame.
  const data: TimeFrameData[] = getDataPointsBetweenTimeFrame(timeFrame).map((time) => {
    const data = timeFrameData.find((data) => dayjs(data.time).startOf(scope).format() === time);

    return {
      requests: data?.requests || 0,
      time,
    };
  });

  const positiveGrowth = totalRequestsGrowth >= 0;

  const tickFormatter = (date: string, index: number): string => {
    switch (timeFrame) {
      // Display label for every fourth hour.
      case DAY: {
        if (index % 4 === 0) {
          return dayjs(date).format(HOUR_FORMAT);
        } else {
          return '';
        }
      }

      // Display label for every day.
      case WEEK_DAYS: {
        return dayjs(date).format(DAY_AND_MONTH_FORMAT);
      }

      // Display label for every fifth day.
      case MONTH_DAYS: {
        if (index % 5 === 0) {
          return dayjs(date).format(DAY_AND_MONTH_FORMAT);
        } else {
          return '';
        }
      }

      // Display label for every second week.
      case THREE_MONTHS_DAYS: {
        if (index % 14 === 0) {
          return dayjs(date).format(DAY_AND_MONTH_FORMAT);
        } else {
          return '';
        }
      }

      // Display label for every month.
      case SIX_MONTHS_DAYS: {
        if (index % 4 === 0) {
          return dayjs(date).format(MONTH_FORMAT);
        } else {
          return '';
        }
      }

      // Display label for every second month.
      case YEAR_DAYS: {
        if (index % 8 === 0) {
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

  const getTotalRequests = (): string => {
    if (totalRequests > 1_000_000) {
      return `${(totalRequests / 1_000_000).toFixed(1)}m`;
    }

    if (totalRequests > 1_000) {
      return `${(totalRequests / 1_000).toFixed(1)}k`;
    }

    return `${totalRequests}`;
  };

  return (
    <DashboardCardContainer loading={loading}>
      <div className="flex flex-col lg:flex-row">
        <div className="p-4">
          <h6 className="text-white">Origin</h6>
          <p className="text-primary text-lg">{name}</p>
        </div>
        <div className="p-4">
          <h6 className="text-white">Total requests</h6>
          <p className="text-lg">{getTotalRequests()}</p>
        </div>
        {isFinite(totalRequestsGrowth) && (
          <div className="p-4">
            <h6 className="text-white">
              Growth (since {TIME_FRAME_OPTIONS[timeFrame].toLowerCase()})
            </h6>
            <p className={clsx('text-lg', positiveGrowth ? 'text-success' : 'text-error')}>
              {positiveGrowth ? '+' : ''}
              {(totalRequestsGrowth * 100).toFixed()}%
            </p>
          </div>
        )}
      </div>
      <div className="mt-4">
        <ResponsiveContainer height={400}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fill-color" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
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
