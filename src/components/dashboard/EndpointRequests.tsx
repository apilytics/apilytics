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
  metrics: { routeData },
  loading,
  selectedEndpoint,
  setSelectedEndpoint,
}) => {
  const data = routeData.sort((a, b) => b.requests - a.requests).map((c) => c);

  return (
    <EndpointMetrics
      key="requests"
      loading={loading}
      title="Requests per route 📊"
      modalName={MODAL_NAMES.requests}
      renderLabels={renderLabels}
      data={data}
      dataKey="requests"
      selectedEndpoint={selectedEndpoint}
      setSelectedEndpoint={setSelectedEndpoint}
    />
  );
};
