import { useState } from 'react';
import type { User } from '@prisma/client';

import type { AccountContextType, OriginInviteData, OriginListItem } from 'types';

export const _useAccountContext = (): AccountContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [origins, setOrigins] = useState<OriginListItem[]>([]);
  const [originInvites, setOriginInvites] = useState<OriginInviteData[]>([]);
  const accountComplete = !!user?.name;

  return {
    user,
    setUser,
    accountComplete,
    origins,
    setOrigins,
    originInvites,
    setOriginInvites,
  };
};
