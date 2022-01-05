import { useContext } from 'react';

import { AccountContext } from 'context/account';
import type { AccountContextType } from 'types';

export const useAccount = (): AccountContextType => {
  const context = useContext(AccountContext);

  if (!context) {
    throw new Error('useAccount must be used within AccountProvider');
  }

  return context;
};
