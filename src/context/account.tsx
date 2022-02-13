import { createContext, useState } from 'react';
import type { Origin, User } from '@prisma/client';

import type { AccountContextType } from 'types';

export const AccountContext = createContext<AccountContextType | null>(null);

export const AccountProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [origins, setOrigins] = useState<Origin[]>([]);
  const accountComplete = !!user?.name;

  const value = {
    user,
    setUser,
    accountComplete,
    origins,
    setOrigins,
  };

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
};
