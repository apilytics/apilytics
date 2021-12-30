import { usePlausible } from 'next-plausible';
import React, { useState } from 'react';

import { Button } from 'components/shared/Button';
import { Input } from 'components/shared/Input';
import { useAccount } from 'hooks/useAccount';
import { UNEXPECTED_ERROR } from 'utils/constants';
import { staticApiRoutes } from 'utils/router';
import type { PlausibleEvents } from 'types';

export const AccountForm: React.FC = () => {
  const { name = '', email = '' } = useAccount().user || {};

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
      const res = await fetch(staticApiRoutes.account, {
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
        // TODO: Brand this for individual users instead of orgs once we have support for teams.
        label="Account name"
        helperText="This can be either your organization name or your personal one."
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
      <Button loading={loading} fullWidth type="submit" className="mt-8">
        Submit
      </Button>
      {submitted && <p className="text-white mt-8">Account settings saved.</p>}
    </form>
  );
};
