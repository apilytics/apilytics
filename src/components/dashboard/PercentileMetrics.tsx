import clsx from 'clsx';
import React, { useState } from 'react';

import { DashboardCard } from 'components/dashboard/DashboardCard';
import { VerticalBarChart } from 'components/dashboard/VerticalBarChart';
import { formatMilliseconds } from 'utils/metrics';
import type { PercentileData, ValueOf } from 'types';

const METRIC_TYPES = {
  responseTimes: 'responseTimes',
  requestSizes: 'requestSizes',
  responseSizes: 'responseSizes',
  cpuUsage: 'cpuUsage',
  memoryUsage: 'memoryUsage',
  memoryTotal: 'memoryTotal',
} as const;

const formatBytes = (value = 0): string => {
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
      renderValue: ({ responseTime }: Partial<PercentileData>) => formatMilliseconds(responseTime),
      valueKey: 'responseTime',
      label: 'Response times',
      emptyLabel: 'No response times available.',
    },
    requestSizes: {
      renderValue: ({ requestSize }: Partial<PercentileData>) => formatBytes(requestSize),
      valueKey: 'requestSize',
      label: 'Requests sizes',
      emptyLabel: 'No request sizes available.',
    },
    responseSizes: {
      renderValue: ({ responseSize }: Partial<PercentileData>) => formatBytes(responseSize),
      valueKey: 'responseSize',
      label: 'Response sizes',
      emptyLabel: 'No response sizes available.',
    },
    cpuUsage: {
      renderValue: ({ cpuUsage = 0 }: Partial<PercentileData>) =>
        `${(Number(cpuUsage) * 100).toFixed(1)} %`,
      valueKey: 'cpuUsage',
      label: 'CPU usage',
      emptyLabel: 'No CPU usage available.',
    },
    memoryUsage: {
      renderValue: ({ memoryUsage }: Partial<PercentileData>) => formatBytes(memoryUsage),
      valueKey: 'memoryUsage',
      label: 'Memory usage',
      emptyLabel: 'No memory usage available.',
    },
    memoryTotal: {
      renderValue: ({ memoryTotal }: Partial<PercentileData>) => formatBytes(memoryTotal),
      valueKey: 'memoryTotal',
      label: 'Total memory',
      emptyLabel: 'No total memory available.',
    },
  } as const;

  const { valueKey, label, emptyLabel, renderValue } = attributes[metricType];

  const renderNoMetrics = !data.length && (
    <div className="flex flex-col items-center justify-center py-40">
      <p>{emptyLabel}</p>
    </div>
  );

  const renderMetrics = (
    <VerticalBarChart
      data={data}
      valueKey={valueKey}
      renderLabel={({ key = '' }: Partial<PercentileData>): string => key}
      renderValue={renderValue}
      leftLabel="Name"
      rightLabel={label}
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
