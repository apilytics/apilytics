import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';

import { LoadingTemplate } from 'components/layout/LoadingTemplate';
import { useAccount } from 'hooks/useAccount';
import { staticApiRoutes } from 'utils/router';

export const withAccount = <T extends Record<string, unknown>>(
  PageComponent: NextPage<T>,
): NextPage<T> => {
  const WithAccount: NextPage<T> = (pageProps: T) => {
    const [loading, setLoading] = useState(true);
    const { setUser } = useAccount();

    useEffect(() => {
      (async (): Promise<void> => {
        const res = await fetch(staticApiRoutes.account);
        const { data } = await res.json();
        setUser(data);
        setLoading(false);
      })();
    }, [setUser]);

    if (loading) {
      return <LoadingTemplate />;
    }

    return <PageComponent {...pageProps} />;
  };

  return WithAccount;
};
