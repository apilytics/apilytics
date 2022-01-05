import { useSession } from 'next-auth/react';
import { createContext, useState } from 'react';

import type { AccountContextType, AggregatedOrigin } from 'types';

export const AccountContext = createContext<AccountContextType | null>(null);

export const AccountProvider: React.FC = ({ children }) => {
  const { data, status } = useSession();
  const { user } = data || {};
  const [origins, setOrigins] = useState<AggregatedOrigin[]>([]);
  const accountComplete = !!user?.name;

  const value = {
    user,
    status,
    accountComplete,
    origins,
    setOrigins,
  };

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
};
