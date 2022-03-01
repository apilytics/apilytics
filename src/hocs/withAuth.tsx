import { ArrowSmRightIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import type { NextPage } from 'next';

import { MainTemplate } from 'components/layout/MainTemplate';
import { AccountForm } from 'components/shared/AccountForm';
import { Button } from 'components/shared/Button';
import { withUser } from 'hocs/withUser';
import { useAccount } from 'hooks/useAccount';
import { staticRoutes } from 'utils/router';

export const withAuth = <T extends Record<string, unknown>>(
  PageComponent: NextPage<T>,
): NextPage<T> => {
  const WithAuth: NextPage<T> = (pageProps: T) => {
    useSession({ required: true });
    const { user, accountComplete } = useAccount();
    const [welcomePassed, setWelcomePassed] = useState(false);

    if (user && !accountComplete) {
      const headProps = { title: 'Welcome 👋' };

      if (!welcomePassed) {
        return (
          <MainTemplate headProps={headProps}>
            <h4 className="text-white">Welcome 👋</h4>
            <p>
              Thank you for signing up to Apilytics beta, we're glad to have you here! We're still
              getting started with our service and developing it tightly with our users. You can
              help us by giving us feedback as well as presenting your feature requests to us by{' '}
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
        <MainTemplate headProps={headProps}>
          <AccountForm title="Finish up your account to complete sign up" isSignUp />
        </MainTemplate>
      );
    }

    return <PageComponent {...pageProps} />;
  };

  return withUser(WithAuth);
};
