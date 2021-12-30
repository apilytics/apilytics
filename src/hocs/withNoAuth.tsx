import Router from 'next/router';
import React, { useEffect } from 'react';
import type { NextPage } from 'next';

import { LoadingTemplate } from 'components/layout/LoadingTemplate';
import { useAccount } from 'hooks/useAccount';
import { staticRoutes } from 'utils/router';

export const withNoAuth = <T extends Record<string, unknown>>(
  PageComponent: NextPage<T>,
): NextPage<T> => {
  const WithNoAuth: NextPage<T> = (pageProps: T) => {
    const { status } = useAccount();
    const redirect = status === 'authenticated';

    // Redirect authenticated users to dashboard.
    useEffect(() => {
      if (redirect) {
        Router.replace(staticRoutes.origins);
      }
    }, [redirect]);

    if (redirect) {
      return <LoadingTemplate />;
    }

    return <PageComponent {...pageProps} />;
  };

  return WithNoAuth;
};
