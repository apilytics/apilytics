import { usePlausible } from 'next-plausible';
import React, { useState } from 'react';

import { Form } from 'components/shared/Form';
import { Input } from 'components/shared/Input';
import { useAccount } from 'hooks/useAccount';
import { UNEXPECTED_ERROR } from 'utils/constants';
import { staticApiRoutes } from 'utils/router';
import type { PlausibleEvents } from 'types';

export const AccountForm: React.FC = () => {
  const { user, setUser } = useAccount();

  const [formValues, setFormValues] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittedText, setSubmittedText] = useState('');
  const plausible = usePlausible<PlausibleEvents>();

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>): void =>
    setFormValues({ ...formValues, [target.name]: target.value });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setSubmittedText('');
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

      const { data, message } = await res.json();

      if (res.status === 200) {
        setError('');
        setSubmittedText('Account settings saved.');
        plausible('update-account');
        setUser(data);
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
    <Form onSubmit={handleSubmit} error={error} loading={loading} submittedText={submittedText}>
      <Input
        name="name"
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
    </Form>
  );
};
