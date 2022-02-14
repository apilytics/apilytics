import clsx from 'clsx';
import React, { useState } from 'react';

import { BarValue } from 'components/dashboard/BarValue';
import { DashboardCard } from 'components/dashboard/DashboardCard';
import { VerticalBarChart } from 'components/dashboard/VerticalBarChart';
import type { PercentileData, ValueOf } from 'types';

const METRIC_TYPES = {
  responseTimes: 'responseTimes',
  requestSizes: 'requestSizes',
  responseSizes: 'responseSizes',
} as const;

const formatMilliseconds = (value?: string | number): string => {
  if (typeof value === 'number') {
    if (value > 1_000) {
      return `${(value / 1_000).toFixed(1)} s`;
    }

    return `${value ?? 0} ms`;
  }

  return '0 ms';
};

const formatBytes = (value?: string | number): string => {
  if (typeof value === 'number') {
    if (value > 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(1)} GB`;
    }

    if (value > 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)} MB`;
    }

    if (value > 1_000) {
      return `${(value / 1_000).toFixed(1)} kB`;
    }

    return `${value ?? 0} b`;
  }

  return '0 b';
};

interface Props {
  data: PercentileData[];
}

export const PercentileMetrics: React.FC<Props> = ({ data }) => {
  const [metricType, setMetricType] = useState<ValueOf<typeof METRIC_TYPES>>(
    METRIC_TYPES.responseTimes,
  );

  const attributes = {
    responseTimes: {
      formatter: formatMilliseconds,
      dataKey: 'responseTime',
      label: 'Response times',
      emptyLabel: 'No response times available.',
    },
    requestSizes: {
      formatter: formatBytes,
      dataKey: 'requestSize',
      label: 'Requests sizes',
      emptyLabel: 'No request sizes available.',
    },
    responseSizes: {
      formatter: formatBytes,
      dataKey: 'responseSize',
      label: 'Response sizes',
      emptyLabel: 'No response sizes available.',
    },
  };

  const { dataKey, label, emptyLabel, formatter } = attributes[metricType];

  const getHeight = (dataLength: number): number => 100 + dataLength * 35;
  const height = getHeight(data.length);

  const renderNoMetrics = !data.length && (
    <div className="flex flex-col items-center justify-center py-40">
      <p>{emptyLabel}</p>
    </div>
  );

  const renderMetrics = (
    <VerticalBarChart
      height={height}
      data={data}
      dataKey={dataKey}
      secondaryDataKey="key"
      renderLabels={<BarValue formatter={formatter} />}
      label="Key"
      secondaryLabel={label}
    />
  );

  return (
    <DashboardCard>
      <div className="flex flex-wrap gap-4 px-2">
        <p className="mr-auto text-white">Performance metrics</p>
        <div className="tabs">
          <p
            className={clsx(
              'tab tab-bordered',
              metricType === METRIC_TYPES.responseTimes && 'tab-active',
            )}
            onClick={(): void => setMetricType(METRIC_TYPES.responseTimes)}
          >
            Response times
          </p>
          <p
            className={clsx(
              'tab tab-bordered',
              metricType === METRIC_TYPES.requestSizes && 'tab-active',
            )}
            onClick={(): void => setMetricType(METRIC_TYPES.requestSizes)}
          >
            Request sizes
          </p>
          <p
            className={clsx(
              'tab tab-bordered',
              metricType === METRIC_TYPES.responseSizes && 'tab-active',
            )}
            onClick={(): void => setMetricType(METRIC_TYPES.responseSizes)}
          >
            Response sizes
          </p>
        </div>
      </div>
      <div className="mt-4">{renderNoMetrics || renderMetrics}</div>
    </DashboardCard>
  );
};
