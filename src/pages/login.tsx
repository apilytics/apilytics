import { useRouter } from 'next/router';
import { getCsrfToken } from 'next-auth/react';
import { usePlausible } from 'next-plausible';
import React, { useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import type { FormEvent } from 'react';

import { MainTemplate } from 'components/layout/MainTemplate';
import { Form } from 'components/shared/Form';
import { Input } from 'components/shared/Input';
import { withNoAuth } from 'hocs/withNoAuth';
import { UNEXPECTED_ERROR } from 'utils/constants';
import { staticApiRoutes, staticRoutes } from 'utils/router';
import type { PlausibleEvents } from 'types';

// https://next-auth.js.org/configuration/pages#error-codes
const ERRORS = {
  Configuration: UNEXPECTED_ERROR,
  AccessDenied: UNEXPECTED_ERROR,
  Verification: 'The sign-in link is expired or has already been used.',
  Default: UNEXPECTED_ERROR,
};

interface Props extends Record<string, unknown> {
  csrfToken: string;
}

const Login: NextPage<Props> = ({ csrfToken }) => {
  const [email, setEmail] = useState('');
  const { query } = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const plausible = usePlausible<PlausibleEvents>();

  // Initialize with an error caused by `next-auth` if one exists.
  const [error, setError] = useState(() => ERRORS[query.error as keyof typeof ERRORS] || '');

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);
    setError('');
    const body = new URLSearchParams({ csrfToken, email, callbackUrl: staticRoutes.root });

    try {
      const res = await fetch(staticApiRoutes.emailSignIn, {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (res.status === 200) {
        setEmail('');
        setError('');
        setSubmitted(true);
        plausible('login');
      } else {
        setError(UNEXPECTED_ERROR);
      }
    } catch {
      setError(UNEXPECTED_ERROR);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <MainTemplate hideLogin>
        <h4 className="text-white">
          Thanks! We sent you a <span className="text-primary">magic</span> link to your email that
          you can log in with.
        </h4>
        <p>
          Didn&lsquo;t receive an email? Check your spam folder and contact us at{' '}
          <a href="mailto:support@apilytics.io">support@apilytics.io</a> is the problem persists.
        </p>
      </MainTemplate>
    );
  }

  return (
    <MainTemplate hideLogin>
      <Form
        title="Sign up or log in using your email"
        onSubmit={handleSubmit}
        error={error}
        loading={loading}
      >
        <Input
          type="email"
          name="email"
          value={email}
          onChange={({ target }): void => setEmail(target.value)}
          label="Email"
          required
        />
      </Form>
    </MainTemplate>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const csrfToken = await getCsrfToken(context);

  return {
    props: { csrfToken },
  };
};

export default withNoAuth(Login);
