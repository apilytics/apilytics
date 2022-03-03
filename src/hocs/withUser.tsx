import React, { useEffect } from 'react';
import type { NextPage } from 'next';

import { useAccount } from 'hooks/useAccount';
import { useUIState } from 'hooks/useUIState';
import { UNEXPECTED_ERROR } from 'utils/constants';
import { staticApiRoutes } from 'utils/router';

export const withUser = <T extends Record<string, unknown>>(
  PageComponent: NextPage<T>,
): NextPage<T> => {
  const WithUser: NextPage<T> = (pageProps: T) => {
    const { setUser, setOriginInvites } = useAccount();
    const { setErrorMessage } = useUIState();

    useEffect(() => {
      (async (): Promise<void> => {
        try {
          const [userRes, originInviteRes] = await Promise.all([
            fetch(staticApiRoutes.user),
            fetch(staticApiRoutes.originInvites),
          ]);

          if (userRes.status === 200 && originInviteRes.status === 200) {
            const [{ data: userData }, { data: originInviteData }] = await Promise.all([
              userRes.json(),
              originInviteRes.json(),
            ]);

            setUser(userData);
            setOriginInvites(originInviteData);
          }
        } catch {
          setErrorMessage(UNEXPECTED_ERROR);
        }
      })();
    }, [setErrorMessage, setOriginInvites, setUser]);

    return <PageComponent {...pageProps} />;
  };

  return WithUser;
};
