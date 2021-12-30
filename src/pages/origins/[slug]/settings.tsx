import Router from 'next/router';
import { usePlausible } from 'next-plausible';
import React, { useState } from 'react';
import type { NextPage } from 'next';

import { MainTemplate } from 'components/layout/MainTemplate';
import { Button } from 'components/shared/Button';
import { ConfirmationModal } from 'components/shared/ConfirmationModal';
import { Input } from 'components/shared/Input';
import { withAuth } from 'hocs/withAuth';
import { withOrigin } from 'hocs/withOrigin';
import { useOpen } from 'hooks/useOpen';
import { useOrigin } from 'hooks/useOrigin';
import { UNEXPECTED_ERROR } from 'utils/constants';
import { dynamicApiRoutes, staticRoutes } from 'utils/router';
import type { PlausibleEvents } from 'types';

const OriginSettings: NextPage = () => {
  const { origin } = useOrigin();
  const { name: _name, apiKey, slug = '' } = origin ?? {};
  const [name, setName] = useState(_name);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const plausible = usePlausible<PlausibleEvents>();

  const {
    open: confirmDeleteModalOpen,
    handleOpen: handleOpenConfirmDeleteModal,
    handleClose: handleCloseConfirmDeleteModal,
  } = useOpen();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);
    setError('');

    try {
      const res = await fetch(dynamicApiRoutes.origin({ slug }), {
        method: 'PUT',
        body: JSON.stringify({ name }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { message } = await res.json();

      if (res.status === 200) {
        setError('');
        setSubmitted(true);
        plausible('update-origin');
      } else {
        setError(message || UNEXPECTED_ERROR);
      }
    } catch {
      setError(UNEXPECTED_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async (): Promise<void> => {
    handleCloseConfirmDeleteModal();
    setLoading(true);
    setSubmitted(false);
    setError('');

    try {
      const res = await fetch(dynamicApiRoutes.origin({ slug }), {
        method: 'DELETE',
      });

      if (res.status === 204) {
        setError('');
        plausible('delete-origin');
        Router.push(staticRoutes.origins);
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
    <MainTemplate>
      <h2 className="text-2xl text-secondary">Origin settings</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <Input
          name="name"
          label="Origin Name"
          helperText='E.g. "example.api.com" or "Internal REST API"'
          value={name}
          onChange={({ target }): void => setName(target.value)}
          required
        />
        <Input
          name="apiKey"
          label="API Key"
          value={apiKey}
          disabled
          helperText="Use this API key in your Apilytics client library to connect with your dashboard."
        />
        {error && <p className="text-red-500">{error}</p>}
        <Button loading={loading} fullWidth type="submit" className="mt-8">
          Submit
        </Button>
        {submitted && <p className="text-white mt-8">Origin settings saved.</p>}
      </form>
      <Button onClick={handleOpenConfirmDeleteModal} variant="secondary" fullWidth className="mt-8">
        Delete origin
      </Button>
      <ConfirmationModal
        open={confirmDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseConfirmDeleteModal}
        text="Are you sure you want to delete this origin?"
      />
    </MainTemplate>
  );
};

export default withOrigin(withAuth(OriginSettings));
