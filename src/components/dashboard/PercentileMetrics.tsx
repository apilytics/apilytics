import clsx from 'clsx';
import React, { useState } from 'react';

import { DashboardCard } from 'components/dashboard/DashboardCard';
import { VerticalBarChart } from 'components/dashboard/VerticalBarChart';
import { formatBytes, formatCpuUsage, formatMilliseconds } from 'utils/metrics';
import type { PercentileData, ValueOf } from 'types';

const METRIC_TYPES = {
  responseTimes: 'responseTimes',
  requestSizes: 'requestSizes',
  responseSizes: 'responseSizes',
  cpuUsage: 'cpuUsage',
  memoryUsage: 'memoryUsage',
  memoryTotal: 'memoryTotal',
} as const;

type MetricType = ValueOf<typeof METRIC_TYPES>;

interface Props {
  data: PercentileData[];
}

export const PercentileMetrics: React.FC<Props> = ({ data }) => {
  const [metricType, setMetricType] = useState<MetricType>(METRIC_TYPES.responseTimes);

  const attributes = {
    responseTimes: {
      renderValue: ({ responseTime }: Partial<PercentileData>) =>
        formatMilliseconds(responseTime ?? 0),
      valueKey: 'responseTime',
      label: 'Response times',
    },
    requestSizes: {
      renderValue: ({ requestSize }: Partial<PercentileData>) => formatBytes(requestSize ?? 0),
      valueKey: 'requestSize',
      label: 'Requests sizes',
    },
    responseSizes: {
      renderValue: ({ responseSize }: Partial<PercentileData>) => formatBytes(responseSize ?? 0),
      valueKey: 'responseSize',
      label: 'Response sizes',
    },
    cpuUsage: {
      renderValue: ({ cpuUsage }: Partial<PercentileData>) => formatCpuUsage(cpuUsage ?? 0),
      valueKey: 'cpuUsage',
      label: 'CPU usage',
    },
    memoryUsage: {
      renderValue: ({ memoryUsage }: Partial<PercentileData>) => formatBytes(memoryUsage ?? 0),
      valueKey: 'memoryUsage',
      label: 'Memory usage',
    },
    memoryTotal: {
      renderValue: ({ memoryTotal }: Partial<PercentileData>) => formatBytes(memoryTotal ?? 0),
      valueKey: 'memoryTotal',
      label: 'Total memory',
    },
  } as const;

  const { valueKey, label, renderValue } = attributes[metricType];

  const renderLabel = ({ key = '' }: Partial<PercentileData>): JSX.Element => (
    <span className="text-white">{key}</span>
  );

  const renderMetrics = (
    <VerticalBarChart
      data={data}
      valueKey={valueKey}
      renderLabel={renderLabel}
      renderValue={renderValue}
      leftLabel="Value"
      rightLabel={label}
    />
  );

  return (
    <DashboardCard>
      <div className="flex flex-wrap gap-4 px-2">
        <p className="mr-auto text-white">{attributes[metricType].label}</p>
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
      <div className="mt-4">{renderMetrics}</div>
    </DashboardCard>
  );
};
