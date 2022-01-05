import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';

import { LoadingTemplate } from 'components/layout/LoadingTemplate';
import { MainTemplate } from 'components/layout/MainTemplate';
import { AccountForm } from 'components/shared/AccountForm';
import { useAccount } from 'hooks/useAccount';
import { staticApiRoutes, staticRoutes } from 'utils/router';

export const withAuth = <T extends Record<string, unknown>>(
  PageComponent: NextPage<T>,
): NextPage<T> => {
  const WithAuth: NextPage<T> = (pageProps: T) => {
    const [loading, setLoading] = useState(false);
    const { status, accountComplete, setOrigins } = useAccount();
    const redirect = status === 'unauthenticated';

    // Redirect unauthenticated users to login.
    useEffect(() => {
      if (redirect) {
        Router.replace(staticRoutes.login);
      }
    }, [redirect]);

    // Fetch all account related data and populate the context.
    useEffect(() => {
      if (!redirect) {
        (async (): Promise<void> => {
          setLoading(true);
          const res = await fetch(staticApiRoutes.origins);
          const { data } = await res.json();
          setOrigins(data);
          setLoading(false);
        })();
      }
    }, [redirect, setOrigins]);

    if (redirect || loading) {
      return <LoadingTemplate />;
    }

    if (!accountComplete) {
      return (
        <MainTemplate hideLogin>
          <h2 className="text-2xl">Finish up your account to continue</h2>
          <AccountForm />
        </MainTemplate>
      );
    }

    return <PageComponent {...pageProps} />;
  };

  return WithAuth;
};
