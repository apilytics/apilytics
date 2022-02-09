import { createContext, useState } from 'react';
import type { Origin } from '@prisma/client';

import { WEEK_DAYS } from 'utils/constants';
import type { OriginContextType, OriginMetrics, TimeFrame } from 'types';

export const OriginContext = createContext<OriginContextType | null>(null);

export const OriginProvider: React.FC = ({ children }) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>(() => WEEK_DAYS);
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [metrics, setMetrics] = useState<OriginMetrics | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>();
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>();
  const [selectedStatusCode, setSelectedStatusCode] = useState<string>();
  const [selectedBrowser, setSelectedBrowser] = useState<string>();
  const [selectedOs, setSelectedOs] = useState<string>();
  const [selectedDevice, setSelectedDevice] = useState<string>();

  const value = {
    origin,
    setOrigin,
    metrics,
    setMetrics,
    timeFrame,
    setTimeFrame,
    selectedMethod,
    setSelectedMethod,
    selectedEndpoint,
    setSelectedEndpoint,
    selectedStatusCode,
    setSelectedStatusCode,
    selectedBrowser,
    setSelectedBrowser,
    selectedOs,
    setSelectedOs,
    selectedDevice,
    setSelectedDevice,
  };

  return <OriginContext.Provider value={value}>{children}</OriginContext.Provider>;
};
