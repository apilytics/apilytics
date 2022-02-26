import Router from 'next/router';
import React, { useState } from 'react';
import type { NextPage } from 'next';

import { MainTemplate } from 'components/layout/MainTemplate';
import { BackButton } from 'components/shared/BackButton';
import { Form } from 'components/shared/Form';
import { Input } from 'components/shared/Input';
import { withAuth } from 'hocs/withAuth';
import { usePlausible } from 'hooks/usePlausible';
import { useUIState } from 'hooks/useUIState';
import { UNEXPECTED_ERROR } from 'utils/constants';
import { dynamicRoutes, staticApiRoutes, staticRoutes } from 'utils/router';

const NewOrigin: NextPage = () => {
  const { setLoading, setErrorMessage } = useUIState();
  const [name, setName] = useState('');
  const plausible = usePlausible();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

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
        setErrorMessage('');
        plausible('new-origin');

        Router.push({
          pathname: dynamicRoutes.origin({ slug: data.slug }),
          query: { showApiKey: true },
        });
      } else {
        setErrorMessage(message || UNEXPECTED_ERROR);
        setLoading(false);
      }
    } catch {
      setErrorMessage(UNEXPECTED_ERROR);
      setLoading(false);
    }
  };

  return (
    <MainTemplate headProps={{ title: 'New origin' }}>
      <div className="card rounded-lg bg-base-100 p-4 shadow">
        <BackButton linkTo={staticRoutes.origins} text="Origins" />
        <Form title="Add new origin" onSubmit={handleSubmit}>
          <Input
            name="name"
            label="Origin name"
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
