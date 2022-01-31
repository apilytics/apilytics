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

export const EndpointResponseTimes: React.FC<Props> = ({ metrics: { endpointData } }) => {
  const data = [...endpointData.sort((a, b) => b.responseTimes.avg - a.responseTimes.avg)];

  return (
    <EndpointMetrics
      label="Response times"
      emptyLabel="No response times available."
      expandButtonLabel="All response times"
      modalName={MODAL_NAMES.responseTimes}
      renderLabels={renderLabels}
      data={data}
      dataKey="responseTimes.avg"
    />
  );
};
