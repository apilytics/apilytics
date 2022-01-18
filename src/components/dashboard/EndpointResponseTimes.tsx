import React from 'react';

import { EndpointMetrics } from 'components/dashboard/EndpointMetrics';
import { EndpointValue } from 'components/dashboard/EndpointValue';
import { MODAL_NAMES } from 'utils/constants';
import type { OriginMetrics } from 'types';

const renderLabels = (
  <EndpointValue formatter={(value?: string | number): string => `${value}ms`} />
);

interface Props {
  metrics: OriginMetrics;
  loading: boolean;
}

export const EndpointResponseTimes: React.FC<Props> = ({ metrics: { routeData }, loading }) => {
  const data = routeData.sort((a, b) => b.avg_response_time - a.avg_response_time).map((c) => c);

  return (
    <EndpointMetrics
      loading={loading}
      title="Response times ⚡"
      modalName={MODAL_NAMES.responseTimes}
      renderLabels={renderLabels}
      data={data}
      dataKey="avg_response_time"
    />
  );
};
