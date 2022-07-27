import React from 'react';

import { TimeFrameMetrics } from 'components/dashboard/TimeFrameMetrics';
import { WEEK_DAYS } from 'utils/constants';
import { getMockMetrics } from 'utils/metrics';

const { generalData, timeFrameData } = getMockMetrics({ intervalDays: WEEK_DAYS });

export const MockRequestsTimeFrame: React.FC = () => (
  <TimeFrameMetrics {...generalData} data={timeFrameData} />
);
