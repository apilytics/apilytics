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
  cpuUsage: 'cpuUsage',
  memoryUsage: 'memoryUsage',
  memoryTotal: 'memoryTotal',
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
    const base = 1024;

    if (value > base ** 3) {
      return `${(value / base ** 3).toFixed(1)} GiB`;
    }

    if (value > base ** 2) {
      return `${(value / base ** 2).toFixed(1)} MiB`;
    }

    if (value > base) {
      return `${(value / base).toFixed(1)} KiB`;
    }

    return `${value ?? 0} B`;
  }

  return '0 B';
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
    cpuUsage: {
      formatter: (value?: string | number): string =>
        `${((Number(value) ?? 0) * 100).toFixed(1)} %`,
      dataKey: 'cpuUsage',
      label: 'CPU usage',
      emptyLabel: 'No CPU usage available.',
    },
    memoryUsage: {
      formatter: formatBytes,
      dataKey: 'memoryUsage',
      label: 'Memory usage',
      emptyLabel: 'No memory usage available.',
    },
    memoryTotal: {
      formatter: formatBytes,
      dataKey: 'memoryTotal',
      label: 'Total memory',
      emptyLabel: 'No total memory available.',
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
          {Object.values(METRIC_TYPES).map((type) => (
            <p
              className={clsx(
                'tab tab-bordered',
                metricType === METRIC_TYPES[type] && 'tab-active',
              )}
              onClick={(): void => setMetricType(METRIC_TYPES[type])}
              key={type}
            >
              {attributes[type].label}
            </p>
          ))}
        </div>
      </div>
      <div className="mt-4">{renderNoMetrics || renderMetrics}</div>
    </DashboardCard>
  );
};
