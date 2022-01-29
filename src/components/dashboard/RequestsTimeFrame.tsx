import React from 'react';

import { DashboardCard } from 'components/dashboard/DashboardCard';
import { TimeFrameAreaChart } from 'components/dashboard/TimeFrameAreaChart';
import { TIME_FRAME_OPTIONS } from 'utils/constants';
import { formatCount } from 'utils/metrics';
import type { OriginMetrics, TimeFrame } from 'types';

interface Props {
  timeFrame: TimeFrame;
  metrics: OriginMetrics;
}

export const RequestsTimeFrame: React.FC<Props> = ({
  timeFrame,
  metrics: { totalRequests, totalRequestsGrowth, timeFrameData },
}) => {
  const positiveGrowth = totalRequestsGrowth >= 0;

  return (
    <DashboardCard>
      <div className="flex flex-wrap px-2 gap-4">
        <p className="text-white">Requests from {TIME_FRAME_OPTIONS[timeFrame].toLowerCase()}</p>
        <p>
          Total requests: <span className="text-white">{formatCount(totalRequests)}</span>
        </p>
        {isFinite(totalRequestsGrowth) && (
          <p>
            Growth from previous {TIME_FRAME_OPTIONS[timeFrame].split('Last')[1].toLowerCase()}:{' '}
            <span className={positiveGrowth ? 'text-success' : 'text-error'}>
              {positiveGrowth ? '+' : ''}
              {(totalRequestsGrowth * 100).toFixed()}%
            </span>
          </p>
        )}
      </div>
      <div className="mt-4">
        <TimeFrameAreaChart
          timeFrame={timeFrame}
          timeFrameData={timeFrameData}
          dataKey="requests"
          color="var(--primary)"
        />
      </div>
    </DashboardCard>
  );
};
