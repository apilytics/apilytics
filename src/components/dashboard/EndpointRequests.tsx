import React from 'react';

import { EndpointMetrics } from 'components/dashboard/EndpointMetrics';
import { EndpointValue } from 'components/dashboard/EndpointValue';
import { MODAL_NAMES } from 'utils/constants';
import { formatCount } from 'utils/metrics';
import type { OriginMetrics } from 'types';

const renderLabels = (
  <EndpointValue formatter={(value?: string | number): string => formatCount(Number(value))} />
);

interface Props {
  metrics: OriginMetrics;
  loading: boolean;
}

export const EndpointRequests: React.FC<Props> = ({ metrics: { endpointData } }) => {
  const data = [...endpointData.sort((a, b) => b.requests - a.requests)];

  return (
    <EndpointMetrics
      label="Requests"
      expandButtonLabel="Show all requests"
      modalName={MODAL_NAMES.requests}
      renderLabels={renderLabels}
      data={data}
      dataKey="requests"
    />
  );
};
