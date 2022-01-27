import Router from 'next/router';
import React, { useState } from 'react';
import type { NextPage } from 'next';

import { MainTemplate } from 'components/layout/MainTemplate';
import { BackButton } from 'components/shared/BackButton';
import { Form } from 'components/shared/Form';
import { Input } from 'components/shared/Input';
import { withAuth } from 'hocs/withAuth';
import { usePlausible } from 'hooks/usePlausible';
import { UNEXPECTED_ERROR } from 'utils/constants';
import { dynamicRoutes, staticApiRoutes, staticRoutes } from 'utils/router';

const NewOrigin: NextPage = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const plausible = usePlausible();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(staticApiRoutes.origins, {
        method: 'POST',
        body: JSON.stringify({ name }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { message, data } = await res.json();

      if (res.status === 201) {
        setError('');
        plausible('new-origin');

        Router.push({
          pathname: dynamicRoutes.origin({ slug: data.slug }),
          query: { showApiKey: true },
        });
      } else {
        setError(message || UNEXPECTED_ERROR);
        setLoading(false);
      }
    } catch {
      setError(UNEXPECTED_ERROR);
      setLoading(false);
    }
  };

  return (
    <MainTemplate headProps={{ title: 'Add new origin' }}>
      <div className="card rounded-lg p-4 shadow bg-base-100">
        <BackButton linkTo={staticRoutes.origins} text="Origins" />
        <Form title="Add new origin" onSubmit={handleSubmit} error={error} loading={loading}>
          <Input
            name="name"
            label="Origin Name"
            helperText='E.g. "example.api.com" or "Internal REST API"'
            value={name}
            onChange={({ target }): void => setName(target.value)}
            required
          />
        </Form>
      </div>
    </MainTemplate>
  );
};

export default withAuth(NewOrigin);
