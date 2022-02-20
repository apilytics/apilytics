import { createContext, useState } from 'react';
import type { User } from '@prisma/client';

import type { AccountContextType, OriginListItem } from 'types';

export const AccountContext = createContext<AccountContextType | null>(null);

export const AccountProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [origins, setOrigins] = useState<OriginListItem[]>([]);
  const accountComplete = !!user?.name;

  const value = {
    loading,
    setLoading,
    error,
    setError,
    user,
    setUser,
    accountComplete,
    origins,
    setOrigins,
  };

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
};
