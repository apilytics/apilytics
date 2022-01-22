import { ArrowSmRightIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';

import { LoadingTemplate } from 'components/layout/LoadingTemplate';
import { MainTemplate } from 'components/layout/MainTemplate';
import { AccountForm } from 'components/shared/AccountForm';
import { Button } from 'components/shared/Button';
import { withAccount } from 'hocs/withAccount';
import { useAccount } from 'hooks/useAccount';
import { staticRoutes } from 'utils/router';

export const withAuth = <T extends Record<string, unknown>>(
  PageComponent: NextPage<T>,
): NextPage<T> => {
  const WithAuth: NextPage<T> = (pageProps: T) => {
    const [welcomePassed, setWelcomePassed] = useState(false);
    const { status, user, accountComplete } = useAccount();
    const redirect = status === 'unauthenticated';

    // Redirect unauthenticated users to login.
    useEffect(() => {
      if (redirect) {
        Router.replace(staticRoutes.login);
      }
    }, [redirect]);

    if (redirect || !user) {
      return <LoadingTemplate />;
    }

    if (!accountComplete) {
      const title = 'Welcome 👋';

      if (!welcomePassed) {
        return (
          <MainTemplate title={title}>
            <h4 className="text-white">Welcome 👋</h4>
            <p>
              Thank you for signing up to Apilytics beta, we&lsquo;re glad to have you here!
              We&lsquo;re still getting started with our service and developing it tightly with our
              users. You can help us by giving us feedback as well as presenting your feature
              requests to us by{' '}
              <Link href={staticRoutes.contact}>
                <a>contacting us</a>
              </Link>
              .
            </p>
            <Button
              className="btn-primary mt-4"
              endIcon={ArrowSmRightIcon}
              onClick={(): void => setWelcomePassed(true)}
            >
              Continue
            </Button>
          </MainTemplate>
        );
      }

      return (
        <MainTemplate title={title}>
          <AccountForm title="Finish up your account to complete sign up" isSignUp />
        </MainTemplate>
      );
    }

    return <PageComponent {...pageProps} />;
  };

  return withAccount(WithAuth);
};
