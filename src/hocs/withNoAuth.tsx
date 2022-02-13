import Router from 'next/router';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import type { NextPage } from 'next';

import { LoadingTemplate } from 'components/layout/LoadingTemplate';
import { staticRoutes } from 'utils/router';

export const withNoAuth = <T extends Record<string, unknown>>(
  PageComponent: NextPage<T>,
): NextPage<T> => {
  const WithNoAuth: NextPage<T> = (pageProps: T) => {
    const { status } = useSession();
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
