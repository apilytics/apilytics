import { useSession } from 'next-auth/react';
import { usePlausible } from 'next-plausible';
import React, { useState } from 'react';

import { Button } from 'components/shared/Button';
import { Input } from 'components/shared/Input';
import { UNEXPECTED_ERROR } from 'utils/constants';
import { apiRoutes } from 'utils/router';
import type { PlausibleEvents } from 'types';

export const AccountForm: React.FC = () => {
  const { name = '', email = '' } = useSession()?.data?.user || {};

  const [formValues, setFormValues] = useState({
    name,
    email,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const plausible = usePlausible<PlausibleEvents>();

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>): void =>
    setFormValues({ ...formValues, [target.name]: target.value });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);
    setError('');
    const payload = { ...formValues };

    try {
      const res = await fetch(apiRoutes.account, {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { message } = await res.json();

      if (res.status === 200) {
        setError('');
        setSubmitted(true);
        plausible('update-account');
      } else {
        setError(message || UNEXPECTED_ERROR);
      }
    } catch {
      setError(UNEXPECTED_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <Input
        name="name"
        label="Account name" // TODO: Brand this for individual users instead of teams/shared accounts once we have support for teams.
        value={formValues.name}
        onChange={handleChange}
        required
      />
      <Input
        name="email"
        label="Your email"
        value={formValues.email}
        onChange={handleChange}
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      <Button disabled={loading} fullWidth type="submit" className="mt-8">
        Submit{' '}
        {loading && (
          <div className="animate-spinner ease-linear rounded-full border-2 border-t-primary h-6 w-6 ml-4" />
        )}
      </Button>
      {submitted && <p className="text-white mt-8">Account details saved.</p>}
    </form>
  );
};
