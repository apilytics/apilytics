import { useContext as _useContext } from 'react';

import { RootContext } from 'context';
import type { RootContextType } from 'types';

export const useContext = (): RootContextType => {
  const context = _useContext(RootContext);

  if (!context) {
    throw new Error('useContext must be used within RootContextProvider');
  }

  return context;
};
