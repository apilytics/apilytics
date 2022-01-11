import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';

import { LoadingTemplate } from 'components/layout/LoadingTemplate';
import { useAccount } from 'hooks/useAccount';
import { staticApiRoutes } from 'utils/router';

export const withAccount = <T extends Record<string, unknown>>(
  PageComponent: NextPage<T>,
): NextPage<T> => {
  const WithAccount: NextPage<T> = (pageProps: T) => {
    const [loading, setLoading] = useState(false);
    const { setUser, setOrigins } = useAccount();

    // Fetch all account related data and populate the context.
    useEffect(() => {
      (async (): Promise<void> => {
        setLoading(true);

        const [accountRes, originsRes] = await Promise.all([
          fetch(staticApiRoutes.account),
          fetch(staticApiRoutes.origins),
        ]);

        const { data: accountData } = await accountRes.json();
        const { data: originsData } = await originsRes.json();
        setUser(accountData);
        setOrigins(originsData);
        setLoading(false);
      })();
    }, [setOrigins, setUser]);

    if (loading) {
      return <LoadingTemplate />;
    }

    return <PageComponent {...pageProps} />;
  };

  return WithAccount;
};
