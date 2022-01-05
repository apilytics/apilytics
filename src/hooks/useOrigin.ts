import { useContext } from 'react';

import { OriginContext } from 'context/origin';
import type { OriginContextType } from 'types';

export const useOrigin = (): OriginContextType => {
  const context = useContext(OriginContext);

  if (!context) {
    throw new Error('useOrigin must be used within OriginProvider');
  }

  return context;
};
