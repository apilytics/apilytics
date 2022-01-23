import { useRouter } from 'next/router';
import { getCsrfToken } from 'next-auth/react';
import React from 'react';
import type { GetServerSideProps, NextPage } from 'next';

import { LoginFormTemplate } from 'components/layout/LoginFormTemplate';
import { withNoAuth } from 'hocs/withNoAuth';
import { UNEXPECTED_ERROR } from 'utils/constants';
import type { LoginPageProps } from 'types';

// https://next-auth.js.org/configuration/pages#error-codes
const ERRORS = {
  Configuration: UNEXPECTED_ERROR,
  AccessDenied: UNEXPECTED_ERROR,
  Verification: 'The sign-in link is expired or has already been used.',
  Default: UNEXPECTED_ERROR,
};

const Login: NextPage<LoginPageProps> = ({ csrfToken }) => {
  const { query } = useRouter();
  const initialError = ERRORS[query.error as keyof typeof ERRORS];

  return (
    <LoginFormTemplate
      title="Login"
      formTitle="Log in using your email"
      initialError={initialError}
      plausibleEvent="login"
      csrfToken={csrfToken}
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
