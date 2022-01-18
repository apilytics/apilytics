import React from 'react';

import { RequestsOverview } from 'components/dashboard/RequestsOverview';
import { MOCK_ORIGIN, WEEK_DAYS } from 'utils/constants';
import { getMockMetrics } from 'utils/metrics';

const timeFrame = WEEK_DAYS;
const origin = MOCK_ORIGIN;
const metrics = getMockMetrics(timeFrame);
const loading = !origin || !metrics;

export const MockRequestsOverview: React.FC = () => (
  <RequestsOverview timeFrame={timeFrame} origin={origin} metrics={metrics} loading={loading} />
);
