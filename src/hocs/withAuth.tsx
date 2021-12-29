import Router from 'next/router';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import type { NextPage } from 'next';

import { Loading } from 'components/layout/Loading';
import { routes } from 'utils/router';

export const withAuth = <T extends Record<string, unknown>>(
  PageComponent: NextPage<T>,
): NextPage<T> => {
  const WithAuth: NextPage<T> = (pageProps: T) => {
    const { data } = useSession();
    const redirect = !data?.user;

    // Redirect unauthenticated users to login.
    useEffect(() => {
      if (redirect) {
        Router.replace(routes.login);
      }
    }, [redirect]);

    // Show loading screen while redirecting.
    if (redirect) {
      return <Loading />;
    }

    return <PageComponent {...pageProps} />;
  };

  return WithAuth;
};
