import React from 'react';

import { EndpointMetrics } from 'components/dashboard/EndpointMetrics';
import { EndpointValue } from 'components/dashboard/EndpointValue';
import { MODAL_NAMES } from 'utils/constants';
import type { EndpointData, OriginMetrics } from 'types';

const renderLabels = (
  <EndpointValue formatter={(value?: string | number): string => `${value}ms`} />
);

interface Props {
  metrics: OriginMetrics;
  loading: boolean;
  selectedEndpoint: EndpointData | null;
  setSelectedEndpoint: (data: EndpointData | null) => void;
}

export const EndpointResponseTimes: React.FC<Props> = ({
  metrics: { endpointData },
  loading,
  selectedEndpoint,
  setSelectedEndpoint,
}) => {
  const data = endpointData.sort((a, b) => b.avg_response_time - a.avg_response_time).map((c) => c);

  return (
    <EndpointMetrics
      loading={loading}
      title="Response times ⚡"
      label="Response times"
      modalName={MODAL_NAMES.responseTimes}
      renderLabels={renderLabels}
      data={data}
      dataKey="avg_response_time"
      selectedEndpoint={selectedEndpoint}
      setSelectedEndpoint={setSelectedEndpoint}
    />
  );
};
