import clsx from 'clsx';
import dayjs from 'dayjs';
import React from 'react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import type { Origin } from '@prisma/client';
import type { OpUnitType } from 'dayjs';

import { DashboardCardContainer } from 'components/dashboard/DashboardCardContainer';
import {
  LAST_3_MONTHS_VALUE,
  LAST_6_MONTHS_VALUE,
  LAST_7_DAYS_VALUE,
  LAST_12_MONTHS_VALUE,
  LAST_24_HOURS_VALUE,
  LAST_30_DAYS_VALUE,
  REQUEST_TIME_FORMAT,
  TIME_FRAME_OPTIONS,
} from 'utils/constants';
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
  let scope: OpUnitType = 'day';

  if (timeFrame === LAST_24_HOURS_VALUE) {
    scope = 'hour';
  }

  // Generate data for each point in time within the specified time frame.
  const getDatesBetweenTimeFrame = (): string[] => {
    const dates = [];
    let currentDateTime = dayjs().subtract(timeFrame, scope);
    const endDateTime = dayjs();

    while (currentDateTime <= endDateTime) {
      dates.push(dayjs(currentDateTime).startOf(scope).format(REQUEST_TIME_FORMAT));
      currentDateTime = dayjs(currentDateTime).add(1, scope);
    }

    return dates;
  };

  // Make sure the data contains points in time for the whole specified time frame.
  const data: TimeFrameData[] = getDatesBetweenTimeFrame().map((time) => {
    const data = timeFrameData.find(
      (data) => dayjs(data.time).startOf(scope).format(REQUEST_TIME_FORMAT) === time,
    );

    return {
      requests: data?.requests || 0,
      time,
    };
  });

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

  const getTotalRequests = (): string => {
    if (totalRequests > 1_000_000) {
      return `${(totalRequests / 100).toFixed(1)}k`;
    }

    if (totalRequests > 1_000) {
      return `${(totalRequests / 100).toFixed(1)}k`;
    }

    return `${totalRequests}`;
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
          <p className="text-lg">{getTotalRequests()}</p>
        </div>
        {isFinite(totalRequestsGrowth) && (
          <div className="p-4">
            <h2 className="text-xl">
              Growth (since {TIME_FRAME_OPTIONS[timeFrame].toLowerCase()})
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
