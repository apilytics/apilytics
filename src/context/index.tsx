import { createContext } from 'react';

import { _useAccountContext } from 'context/account';
import { _useOriginContext } from 'context/origin';
import { _useUIContext } from 'context/ui';
import type { RootContextType } from 'types';

export const RootContext = createContext<RootContextType | null>(null);

export const RootContextProvider: React.FC = ({ children }) => {
  const accountContext = _useAccountContext();
  const originContext = _useOriginContext();
  const uiContext = _useUIContext();

  const value = {
    ...accountContext,
    ...originContext,
    ...uiContext,
  };

  return <RootContext.Provider value={value}>{children}</RootContext.Provider>;
};
