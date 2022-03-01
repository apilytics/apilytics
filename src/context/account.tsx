import { createContext, useState } from 'react';
import type { User } from '@prisma/client';

import type { AccountContextType, OriginInviteData, OriginListItem } from 'types';

export const AccountContext = createContext<AccountContextType | null>(null);

export const AccountProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [origins, setOrigins] = useState<OriginListItem[]>([]);
  const [originInvites, setOriginInvites] = useState<OriginInviteData[]>([]);
  const accountComplete = !!user?.name;

  const value = {
    user,
    setUser,
    accountComplete,
    origins,
    setOrigins,
    originInvites,
    setOriginInvites,
  };

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
};
