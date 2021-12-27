import { usePlausible } from 'next-plausible';
import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import type { FormEvent } from 'react';

import { Layout } from 'components/layout/Layout';
import { Button } from 'components/shared/Button';
import { Input } from 'components/shared/Input';
import { UNEXPECTED_ERROR } from 'utils/constants';
import { apiRoutes } from 'utils/router';
import type { PlausibleEvents } from 'types';

const initialFormValues = {
  email: '',
};

const SignIn: NextPage = () => {
  const [csrfToken, setCsrfToken] = useState('');
  const [formValues, setFormValues] = useState(initialFormValues);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const plausible = usePlausible<PlausibleEvents>();

  useEffect(() => {
    (async (): Promise<void> => {
      const res = await fetch(apiRoutes.csrfToken);
      const { csrfToken } = await res.json();
      setCsrfToken(csrfToken);
    })();
  }, []);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);
    setError('');
    const body = new URLSearchParams({ csrfToken, ...formValues });

    try {
      const res = await fetch(apiRoutes.emailSignIn, {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (res.status === 200) {
        setFormValues(initialFormValues);
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

  const handleChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void =>
    setFormValues({ ...formValues, [target.name]: target.value });

  return (
    <Layout noIndex headerMaxWidth="3xl">
      <div className="bg-background bg-no-repeat bg-cover flex grow">
        <div className="bg-filter grow">
          <div className="container max-w-3xl mx-auto py-16">
            <h2 className="text-2xl text-secondary animate-fade-in-top animation-delay-400">
              Sign in
            </h2>
            <form
              onSubmit={handleSubmit}
              className="mt-4 text-left animate-fade-in-top animation-delay-800"
            >
              <Input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                label="Email"
                required
              />
              {error && <p className="text-red-500">{error}</p>}
              <Button disabled={loading} fullWidth type="submit" className="mt-8">
                Log in{' '}
                {loading && (
                  <div className="animate-spinner ease-linear rounded-full border-2 border-t-primary h-6 w-6 ml-4" />
                )}
              </Button>
              {submitted && <p className="text-white mt-8">Success! Check your email inbox.</p>}
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignIn;
