import React from 'react';

import { RequestsTimeFrame } from 'components/dashboard/RequestsTimeFrame';
import { WEEK_DAYS } from 'utils/constants';
import { getMockMetrics } from 'utils/metrics';

const timeFrame = WEEK_DAYS;
const metrics = getMockMetrics(timeFrame);

export const MockRequestsTimeFrame: React.FC = () => (
  <RequestsTimeFrame timeFrame={timeFrame} metrics={metrics} />
);
