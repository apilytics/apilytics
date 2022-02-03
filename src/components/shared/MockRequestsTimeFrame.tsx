import React from 'react';

import { TimeFrameMetrics } from 'components/dashboard/TimeFrameMetrics';
import { WEEK_DAYS } from 'utils/constants';
import { getMockMetrics } from 'utils/metrics';

const { totalRequests, totalErrors, timeFrameData } = getMockMetrics({ timeFrame: WEEK_DAYS });

export const MockRequestsTimeFrame: React.FC = () => (
  <TimeFrameMetrics totalRequests={totalRequests} totalErrors={totalErrors} data={timeFrameData} />
);
