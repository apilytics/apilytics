import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';

import { ErrorTemplate } from 'components/layout/ErrorTemplate';
import { useAccount } from 'hooks/useAccount';
import { staticApiRoutes } from 'utils/router';

export const withUser = <T extends Record<string, unknown>>(
  PageComponent: NextPage<T>,
): NextPage<T> => {
  const WithUser: NextPage<T> = (pageProps: T) => {
    const [error, setError] = useState(false);
    const { setUser, setLoading } = useAccount();

    useEffect(() => {
      (async (): Promise<void> => {
        setLoading(true);

        try {
          const res = await fetch(staticApiRoutes.user);
          const { data = null } = await res.json();
          setUser(data);
        } catch {
          setError(true);
        } finally {
          setLoading(false);
        }
      })();
    }, [setLoading, setUser]);

    if (error) {
      return <ErrorTemplate />;
    }

    return <PageComponent {...pageProps} />;
  };

  return WithUser;
};
