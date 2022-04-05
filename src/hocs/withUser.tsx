import React from 'react';
import type { User } from '@prisma/client';
import type { NextPage } from 'next';

import { useContext } from 'hooks/useContext';
import { useFetch } from 'hooks/useFetch';
import { staticApiRoutes } from 'utils/router';
import type { OriginInviteData } from 'types';

export const withUser = <T extends Record<string, unknown>>(
  PageComponent: NextPage<T>,
): NextPage<T> => {
  const WithUser: NextPage<T> = (pageProps: T) => {
    const { setUser, setOriginInvites } = useContext();

    useFetch<User>({ url: staticApiRoutes.user, successCallback: ({ data }) => setUser(data) });

    useFetch<OriginInviteData[]>({
      url: staticApiRoutes.originInvites,
      successCallback: ({ data }) => setOriginInvites(data),
    });

    return <PageComponent {...pageProps} />;
  };

  return WithUser;
};
