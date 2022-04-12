import Link from 'next/link';
import { useRouter } from 'next/router';
import { getCsrfToken } from 'next-auth/react';
import React from 'react';
import type { GetServerSideProps, NextPage } from 'next';

import { LoginFormTemplate } from 'components/layout/LoginFormTemplate';
import { withNoAuth } from 'hocs/withNoAuth';
import { UNEXPECTED_ERROR } from 'utils/constants';
import { staticRoutes } from 'utils/router';
import type { LoginPageProps } from 'types';

// https://next-auth.js.org/configuration/pages#error-codes
const ERRORS = {
  Configuration: UNEXPECTED_ERROR,
  AccessDenied: UNEXPECTED_ERROR,
  Verification: 'The sign-in link is expired or has already been used.',
  SessionRequired: 'You need to log in to view this page.',
  Default: UNEXPECTED_ERROR,
};

const Login: NextPage<LoginPageProps> = ({ csrfToken }) => {
  const { query } = useRouter();
  const initialError = ERRORS[query.error as keyof typeof ERRORS];

  const renderRegisterLink = (
    <p className="mt-4 text-sm">
      Don't have an account yet? Start your free trial by{' '}
      <Link href={staticRoutes.register}>registering a new account</Link>.
    </p>
  );

  return (
    <LoginFormTemplate
      title="Log in"
      description="Log in to your account to view your metrics and start analyzing your APIs. We will send a magic link to your email address."
      formTitle="Log in using your email"
      initialError={initialError}
      plausibleEvent="login"
      csrfToken={csrfToken}
      contentAfter={renderRegisterLink}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const csrfToken = await getCsrfToken(context);

  return {
    props: { csrfToken },
  };
};

export default withNoAuth(Login);
