import Router from 'next/router';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import type { NextPage } from 'next';

import { Loading } from 'components/layout/Loading';
import { routes } from 'utils/router';

export const withNoAuth = <T extends Record<string, unknown>>(
  PageComponent: NextPage<T>,
): NextPage<T> => {
  const WithNoAuth: NextPage<T> = (pageProps: T) => {
    const { data } = useSession();
    const redirect = !!data?.user;

    // Redirect authenticated users to dashboard.
    useEffect(() => {
      if (redirect) {
        Router.replace(routes.dashboard);
      }
    }, [redirect]);

    // Show loading screen while redirecting.
    if (redirect) {
      return <Loading />;
    }

    return <PageComponent {...pageProps} />;
  };

  return WithNoAuth;
};
