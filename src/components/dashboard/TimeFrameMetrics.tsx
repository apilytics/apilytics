import clsx from 'clsx';
import React, { useState } from 'react';

import { DashboardCard } from 'components/dashboard/DashboardCard';
import { TimeFrameAreaChart } from 'components/dashboard/TimeFrameAreaChart';
import { formatCount } from 'utils/metrics';
import type { OriginMetrics, TimeFrameData } from 'types';

const METRIC_TYPES = {
  requests: 'requests',
  errors: 'errors',
};

interface Props extends Pick<OriginMetrics, 'totalRequests' | 'totalErrors'> {
  data: TimeFrameData[];
}

export const TimeFrameMetrics: React.FC<Props> = ({ totalRequests, totalErrors, data }) => {
  const [metricType, setMetricType] = useState(METRIC_TYPES.requests);

  const attributes = {
    requests: {
      label: 'Requests',
      dataKey: 'requests',
      color: 'var(--primary)',
      totalCount: totalRequests,
    },
    errors: {
      label: 'Errors',
      dataKey: 'errors',
      color: 'var(--error)',
      totalCount: totalErrors,
    },
  };

  const { label, dataKey, color, totalCount } = attributes[metricType as keyof typeof attributes];

  return (
    <DashboardCard>
      <div className="flex flex-wrap px-2 gap-4">
        <p className="text-white mr-auto">
          Total {label.toLowerCase()}: <span className="text-white">{formatCount(totalCount)}</span>
        </p>
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
