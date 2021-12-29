import { useRouter } from 'next/router';
import { getCsrfToken } from 'next-auth/react';
import { usePlausible } from 'next-plausible';
import React, { useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import type { FormEvent } from 'react';

import { Layout } from 'components/layout/Layout';
import { Button } from 'components/shared/Button';
import { Input } from 'components/shared/Input';
import { withNoAuth } from 'hocs/withNoAuth';
import { UNEXPECTED_ERROR } from 'utils/constants';
import { apiRoutes } from 'utils/router';
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
    const body = new URLSearchParams({ csrfToken, email });

    try {
      const res = await fetch(apiRoutes.emailSignIn, {
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

  return (
    <Layout noIndex headerMaxWidth="3xl" hideLogin>
      <div className="bg-background bg-no-repeat bg-cover flex grow">
        <div className="bg-filter grow">
          <div className="container max-w-3xl mx-auto py-16 animate-fade-in-top animation-delay-400">
            {!submitted ? (
              <>
                <h2 className="text-2xl text-secondary">
                  Type your email to log in or register a new user
                </h2>
                <form onSubmit={handleSubmit} className="mt-4 text-left">
                  <Input
                    type="email"
                    name="email"
                    value={email}
                    onChange={({ target }): void => setEmail(target.value)}
                    label="Email"
                    required
                  />
                  {error && <p className="text-red-500">{error}</p>}
                  <Button disabled={loading} fullWidth type="submit" className="mt-4">
                    Submit{' '}
                    {loading && (
                      <div className="animate-spinner ease-linear rounded-full border-2 border-t-primary h-6 w-6 ml-4" />
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <h1 className="text-white text-3xl mt-4">
                Thanks! We sent you a <span className="text-primary">magic</span> link to your email
                that you can log in with.
              </h1>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const csrfToken = await getCsrfToken(context);

  return {
    props: { csrfToken },
  };
};

export default withNoAuth(Login);
