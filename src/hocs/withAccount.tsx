import React, { useEffect } from 'react';
import type { NextPage } from 'next';

import { useAccount } from 'hooks/useAccount';
import { staticApiRoutes } from 'utils/router';

export const withAccount = <T extends Record<string, unknown>>(
  PageComponent: NextPage<T>,
): NextPage<T> => {
  const WithAccount: NextPage<T> = (pageProps: T) => {
    const { setUser } = useAccount();

    useEffect(() => {
      (async (): Promise<void> => {
        const res = await fetch(staticApiRoutes.account);
        const { data } = await res.json();
        setUser(data);
      })();
    }, [setUser]);

    return <PageComponent {...pageProps} />;
  };

  return WithAccount;
};
