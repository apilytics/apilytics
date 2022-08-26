import type { User } from '@prisma/client';

import { useContext } from 'hooks/useContext';
import { useFetch } from 'hooks/useFetch';
import { staticApiRoutes } from 'utils/router';
import type { OriginInviteData } from 'types';

export const CommonDataProvider: React.FC = ({ children }) => {
  const { setUser, setOriginInvites } = useContext();

  useFetch<User>({
    url: staticApiRoutes.user,
    successCallback: ({ data }) => setUser(data),
    hideErrorMessage: true,
  });

  useFetch<OriginInviteData[]>({
    url: staticApiRoutes.originInvites,
    successCallback: ({ data }) => setOriginInvites(data),
    hideErrorMessage: true,
  });

  return <>{children}</>;
};
