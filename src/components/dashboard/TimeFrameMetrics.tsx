import clsx from 'clsx';
import React, { useState } from 'react';

import { DashboardCard } from 'components/dashboard/DashboardCard';
import { TimeFrameAreaChart } from 'components/dashboard/TimeFrameAreaChart';
import { formatCount } from 'utils/metrics';
import type { GeneralData, TimeFrameData, ValueOf } from 'types';

const METRIC_TYPES = {
  requests: 'requests',
  errors: 'errors',
} as const;

interface Props extends GeneralData {
  data: TimeFrameData[];
}

export const TimeFrameMetrics: React.FC<Props> = ({
  totalRequests,
  totalRequestsGrowth,
  totalErrors,
  totalErrorsGrowth,
  errorRate,
  errorRateGrowth,
  data,
}) => {
  const [metricType, setMetricType] = useState<ValueOf<typeof METRIC_TYPES>>(METRIC_TYPES.requests);
  const positiveTotalRequestsGrowth = totalRequestsGrowth >= 0;
  const positiveTotalErrorsGrowth = totalErrorsGrowth <= 0;
  const positiveErrorRateGrowth = errorRateGrowth <= 0;

  const attributes = {
    requests: {
      dataKey: 'requests',
      color: 'var(--primary)',
    },
    errors: {
      dataKey: 'errors',
      color: 'var(--error)',
    },
  };

  const { dataKey, color } = attributes[metricType];

  return (
    <DashboardCard>
      <div className="flex flex-wrap items-start gap-4 px-2">
        <div className="mr-auto flex flex-wrap gap-6">
          <div className="text-white">
            <p>Total requests</p>
            <span className="ml-1 text-lg font-bold">{formatCount(totalRequests)}</span>
            {isFinite(totalRequestsGrowth) && (
              <span
                className={clsx(
                  'ml-2',
                  positiveTotalRequestsGrowth ? 'text-success' : 'text-error',
                )}
              >
                {totalRequestsGrowth < 0 ? '-' : '+'}
                {totalRequestsGrowth}%
              </span>
            )}
          </div>
          <div className="text-white">
            <p>Total errors</p>
            <span className="ml-1 text-lg font-bold">{formatCount(totalErrors)}</span>
            {isFinite(totalErrorsGrowth) && (
              <span
                className={clsx('ml-2', positiveTotalErrorsGrowth ? 'text-success' : 'text-error')}
              >
                {totalErrorsGrowth < 0 ? '-' : '+'}
                {totalErrorsGrowth}%
              </span>
            )}
          </div>
          <div className="text-white">
            <p>Error rate</p>
            <span className="ml-1 text-lg font-bold">{formatCount(errorRate, 2)}</span>
            {isFinite(errorRateGrowth) && (
              <span
                className={clsx('ml-2', positiveErrorRateGrowth ? 'text-success' : 'text-error')}
              >
                {errorRateGrowth < 0 ? '-' : '+'}
                {errorRateGrowth}%
              </span>
            )}
          </div>
        </div>
        <div className="tabs">
          <p
            className={clsx(
              'tab tab-bordered',
              metricType === METRIC_TYPES.requests && 'tab-active',
            )}
            onClick={(): void => setMetricType(METRIC_TYPES.requests)}
          >
            Requests
          </p>
          <p
            className={clsx('tab tab-bordered', metricType === METRIC_TYPES.errors && 'tab-active')}
            onClick={(): void => setMetricType(METRIC_TYPES.errors)}
          >
            Errors
          </p>
        </div>
      </div>
      <div className="mt-4">
        <TimeFrameAreaChart data={data} dataKey={dataKey} color={color} />
      </div>
    </DashboardCard>
  );
};
