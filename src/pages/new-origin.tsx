import Router from 'next/router';
import React from 'react';
import type { NextPage } from 'next';

import { MainTemplate } from 'components/layout/MainTemplate';
import { BackButton } from 'components/shared/BackButton';
import { Form } from 'components/shared/Form';
import { Input } from 'components/shared/Input';
import { withAuth } from 'hocs/withAuth';
import { useForm } from 'hooks/useForm';
import { usePlausible } from 'hooks/usePlausible';
import { dynamicRoutes, staticApiRoutes, staticRoutes } from 'utils/router';
import type { OriginData } from 'types';

const NewOrigin: NextPage = () => {
  const {
    loading,
    formValues: { name },
    onInputChange,
    submitForm,
  } = useForm({
    name: '',
  });

  const plausible = usePlausible();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    submitForm<OriginData>({
      url: staticApiRoutes.origins,
      options: {
        method: 'POST',
        body: JSON.stringify({ name }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
      successCallback: ({ data: { slug } }): void => {
        plausible('new-origin');

        Router.push({
          pathname: dynamicRoutes.origin({ slug }),
          query: { showApiKey: true },
        });
      },
    });
  };

  return (
    <MainTemplate headProps={{ title: 'New origin' }}>
      <div className="card rounded-lg bg-base-100 p-4 shadow">
        <BackButton linkTo={staticRoutes.origins} text="Origins" />
        <Form title="Add new origin" onSubmit={handleSubmit} loading={loading}>
          <Input
            name="name"
            label="Origin name"
            helperText='E.g. "example.api.com" or "Internal REST API"'
            value={name}
            onChange={onInputChange}
            required
          />
        </Form>
      </div>
    </MainTemplate>
  );
};

export default withAuth(NewOrigin);
