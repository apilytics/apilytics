import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';

import { ErrorTemplate } from 'components/layout/ErrorTemplate';
import { useAccount } from 'hooks/useAccount';
import { staticApiRoutes } from 'utils/router';

export const withAccount = <T extends Record<string, unknown>>(
  PageComponent: NextPage<T>,
): NextPage<T> => {
  const WithAccount: NextPage<T> = (pageProps: T) => {
    const [error, setError] = useState(false);
    const { setUser } = useAccount();

    useEffect(() => {
      (async (): Promise<void> => {
        try {
          const res = await fetch(staticApiRoutes.account);
          const { data } = await res.json();
          setUser(data);
        } catch {
          setError(true);
        }
      })();
    }, [setUser]);

    if (error) {
      return <ErrorTemplate />;
    }

    return <PageComponent {...pageProps} />;
  };

  return WithAccount;
};
