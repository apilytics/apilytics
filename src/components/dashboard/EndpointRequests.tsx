import React from 'react';

import { EndpointMetrics } from 'components/dashboard/EndpointMetrics';
import { EndpointValue } from 'components/dashboard/EndpointValue';
import { MODAL_NAMES } from 'utils/constants';
import { formatRequests } from 'utils/metrics';
import type { EndpointData, OriginMetrics } from 'types';

const renderLabels = (
  <EndpointValue formatter={(value?: string | number): string => formatRequests(Number(value))} />
);

interface Props {
  metrics: OriginMetrics;
  loading: boolean;
  selectedEndpoint: EndpointData | null;
  setSelectedEndpoint: (data: EndpointData | null) => void;
}

export const EndpointRequests: React.FC<Props> = ({
  metrics: { endpointData },
  loading,
  selectedEndpoint,
  setSelectedEndpoint,
}) => {
  const data = endpointData.sort((a, b) => b.requests - a.requests).map((c) => c);

  return (
    <EndpointMetrics
      loading={loading}
      title="Requests per route 📊"
      label="Requests"
      modalName={MODAL_NAMES.requests}
      renderLabels={renderLabels}
      data={data}
      dataKey="requests"
      selectedEndpoint={selectedEndpoint}
      setSelectedEndpoint={setSelectedEndpoint}
    />
  );
};
