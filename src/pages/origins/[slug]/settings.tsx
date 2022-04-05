import Router from 'next/router';
import React, { useEffect, useMemo } from 'react';
import type { NextPage } from 'next';

import { MainTemplate } from 'components/layout/MainTemplate';
import { ApiKeyField } from 'components/shared/ApiKeyField';
import { BackButton } from 'components/shared/BackButton';
import { ConfirmModal } from 'components/shared/ConfirmModal';
import { Form } from 'components/shared/Form';
import { Input } from 'components/shared/Input';
import { withAuth } from 'hocs/withAuth';
import { withOrigin } from 'hocs/withOrigin';
import { useContext } from 'hooks/useContext';
import { useForm } from 'hooks/useForm';
import { usePlausible } from 'hooks/usePlausible';
import { MODAL_NAMES } from 'utils/constants';
import { dynamicApiRoutes, dynamicRoutes, staticRoutes } from 'utils/router';
import type { OriginData } from 'types';

const OriginSettings: NextPage = () => {
  const plausible = usePlausible();
  const { handleOpenModal, handleCloseModal, origin, setOrigin } = useContext();
  const { name: initialName, apiKey = '', slug = '' } = origin ?? {};

  const initialFormValues = useMemo(
    () => ({
      name: initialName,
      apiKey,
      slug,
    }),
    [apiKey, initialName, slug],
  );

  const {
    loading,
    formValues: { name },
    setFormValues,
    onInputChange,
    submitForm,
  } = useForm(initialFormValues);

  useEffect(() => {
    setFormValues(initialFormValues);
  }, [apiKey, initialFormValues, initialName, setFormValues, slug]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    submitForm<OriginData>({
      url: dynamicApiRoutes.origin({ slug }),
      options: {
        method: 'PATCH',
        body: JSON.stringify({ name }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
      successCallback: ({ data }) => {
        setOrigin(data);
        plausible('update-origin');
        Router.replace(dynamicRoutes.originSettings({ slug: data.slug }));
      },
    });
  };

  const handleConfirmDelete = (): void => {
    handleCloseModal();

    submitForm({
      url: dynamicApiRoutes.origin({ slug }),
      options: {
        method: 'DELETE',
      },
      successCallback: () => {
        plausible('delete-origin');
        Router.push(staticRoutes.origins);
      },
    });
  };

  const renderDeleteOriginLink = (
    <p
      onClick={(): void => handleOpenModal(MODAL_NAMES.DELETE_ORIGIN)}
      className="link mt-4 text-center text-error"
    >
      Delete origin
    </p>
  );

  return (
    <MainTemplate
      headProps={{ title: origin?.name ? `Settings for ${origin.name}` : 'Loading...' }}
    >
      <div className="card rounded-lg bg-base-100 p-4 shadow">
        <BackButton linkTo={dynamicRoutes.origin({ slug })} text="Dashboard" />
        <Form
          title={`Settings for ${origin?.name}`}
          onSubmit={handleSubmit}
          contentAfter={renderDeleteOriginLink}
          loading={loading}
        >
          <Input
            name="name"
            label="Origin name"
            helperText='E.g. "example.api.com" or "Internal REST API"'
            value={name}
            onChange={onInputChange}
            required
          />
          <ApiKeyField value={apiKey} />
          <ConfirmModal
            title="Delete origin"
            name={MODAL_NAMES.DELETE_ORIGIN}
            onConfirm={handleConfirmDelete}
            loading={loading}
            dangerAction
          >
            <p>
              Are you sure you want to delete this origin?
              <br />
              All data associated with it will be lost forever.
            </p>
          </ConfirmModal>
        </Form>
      </div>
    </MainTemplate>
  );
};

export default withAuth(withOrigin(OriginSettings));
