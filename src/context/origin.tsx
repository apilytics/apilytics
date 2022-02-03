import { createContext, useState } from 'react';
import type { Origin } from '@prisma/client';

import { WEEK_DAYS } from 'utils/constants';
import type { EndpointData, OriginContextType, OriginMetrics, TimeFrame } from 'types';

export const OriginContext = createContext<OriginContextType | null>(null);

export const OriginProvider: React.FC = ({ children }) => {
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [metrics, setMetrics] = useState<OriginMetrics | null>(null);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>(WEEK_DAYS);
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointData | null>(null);

  const value = {
    origin,
    setOrigin,
    metrics,
    setMetrics,
    timeFrame,
    setTimeFrame,
    selectedEndpoint,
    setSelectedEndpoint,
  };

  return <OriginContext.Provider value={value}>{children}</OriginContext.Provider>;
};
