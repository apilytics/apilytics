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
    const { setUser } = useAccount();

    useEffect(() => {
      (async (): Promise<void> => {
        try {
          const res = await fetch(staticApiRoutes.user);

          if (res.status === 200) {
            const { data } = await res.json();
            setUser(data);
          } else {
            setError(true);
          }
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

  return WithUser;
};
