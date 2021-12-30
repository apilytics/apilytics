import { createContext, useState } from 'react';
import type { Origin } from '@prisma/client';

import type { OriginContextType, OriginMetrics } from 'types';

export const OriginContext = createContext<OriginContextType | null>(null);

export const OriginProvider: React.FC = ({ children }) => {
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [metrics, setMetrics] = useState<OriginMetrics | null>(null);

  const value = {
    origin,
    setOrigin,
    metrics,
    setMetrics,
  };

  return <OriginContext.Provider value={value}>{children}</OriginContext.Provider>;
};
