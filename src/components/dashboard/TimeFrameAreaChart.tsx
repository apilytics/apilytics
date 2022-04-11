import dayjs from 'dayjs';
import React from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TooltipProps } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

import { useContext } from 'hooks/useContext';
import {
  DAY,
  MONTH_DAYS,
  SIX_MONTHS_DAYS,
  THREE_MONTHS_DAYS,
  WEEK_DAYS,
  YEAR_DAYS,
} from 'utils/constants';
import { formatCount, getDataPointsBetweenTimeFrame, getTimeFrameScope } from 'utils/metrics';
import type { TimeFrameData } from 'types';

const HOUR_FORMAT = 'h A';
const DAY_AND_MONTH_FORMAT = 'ddd, D MMM';
const MONTH_FORMAT = 'MMMM';

interface Props {
  data: TimeFrameData[];
  dataKey: string;
  color: string;
}

export const TimeFrameAreaChart: React.FC<Props> = ({ data: _data, dataKey, color }) => {
  const { timeFrame } = useContext();
  const scope = getTimeFrameScope(timeFrame);

  // Make sure the data contains points in time for the whole specified time frame.
  const data: TimeFrameData[] = getDataPointsBetweenTimeFrame(timeFrame).map((time) => {
    const data = _data.find((data) => dayjs(data.time).startOf(scope).format() === time);

    return {
      requests: data?.requests || 0,
      errors: data?.errors || 0,
      time,
    };
  });

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

  const renderTooltipContent = ({
    payload,
  }: TooltipProps<ValueType, NameType>): JSX.Element | null => {
    if (payload?.length) {
      const { requests, errors, time } = payload[0].payload;
      let format: string | undefined;

      switch (timeFrame) {
        case DAY: {
          format = HOUR_FORMAT;
          break;
        }

        case WEEK_DAYS:
        case MONTH_DAYS:
        case THREE_MONTHS_DAYS: {
          format = DAY_AND_MONTH_FORMAT;
          break;
        }

        case SIX_MONTHS_DAYS:
        case YEAR_DAYS: {
          format = MONTH_FORMAT;
          break;
        }
      }

      return (
        <div className="card rounded-lg bg-base-100 p-4 shadow">
          <ul className="list-none">
            <li className="text-primary">{dayjs(time).format(format)}</li>
            <li>
              Requests: <span className="font-bold">{formatCount(requests)}</span>
            </li>
            <li>
              Errors: <span className="font-bold">{formatCount(errors)}</span>
            </li>
            <li>
              Error rate:{' '}
              <span className="font-bold">{formatCount(errors / requests || 0, 2)}</span>
            </li>
          </ul>
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer height={400}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`${dataKey}-fill-color`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="50%" stopColor={color} stopOpacity={0.15} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
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
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          fill={`url(#${dataKey}-fill-color)`}
        />
        <Tooltip content={renderTooltipContent} />
      </AreaChart>
    </ResponsiveContainer>
  );
};
