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

export const ErrorsTimeFrame: React.FC<Props> = ({
  timeFrame,
  metrics: { totalErrors, totalErrorsGrowth, timeFrameData },
}) => {
  const positiveGrowth = totalErrorsGrowth >= 0;

  return (
    <DashboardCard>
      <div className="flex flex-wrap px-2 gap-4">
        <p className="text-white">Errors from {TIME_FRAME_OPTIONS[timeFrame].toLowerCase()}</p>
        <p>
          Total errors: <span className="text-white">{formatCount(totalErrors)}</span>
        </p>
        {isFinite(totalErrorsGrowth) && (
          <p>
            Growth from previous {TIME_FRAME_OPTIONS[timeFrame].split('Last')[1].toLowerCase()}):{' '}
            <span className={positiveGrowth ? 'text-error' : 'text-success'}>
              {positiveGrowth ? '+' : ''}
              {(totalErrorsGrowth * 100).toFixed()}%
            </span>
          </p>
        )}
      </div>
      <div className="mt-4">
        <TimeFrameAreaChart
          timeFrame={timeFrame}
          timeFrameData={timeFrameData}
          dataKey="errors"
          stopColor="var(--error)"
        />
      </div>
    </DashboardCard>
  );
};
