import React from 'react';

import { RequestsTimeFrame } from 'components/dashboard/RequestsTimeFrame';
import { MOCK_ORIGIN, WEEK_DAYS } from 'utils/constants';
import { getMockMetrics } from 'utils/metrics';

const timeFrame = WEEK_DAYS;
const origin = MOCK_ORIGIN;
const metrics = getMockMetrics(timeFrame);
const loading = !origin || !metrics;

export const MockRequestsTimeFrame: React.FC = () => (
  <RequestsTimeFrame timeFrame={timeFrame} origin={origin} metrics={metrics} loading={loading} />
);
