import { XIcon } from '@heroicons/react/solid';
import Router from 'next/router';
import { usePlausible } from 'next-plausible';
import React, { useState } from 'react';
import type { NextPage } from 'next';

import { MainTemplate } from 'components/layout/MainTemplate';
import { ApiKeyField } from 'components/shared/ApiKeyField';
import { Button } from 'components/shared/Button';
import { Form } from 'components/shared/Form';
import { IconButton } from 'components/shared/IconButton';
import { Input } from 'components/shared/Input';
import { ModalCloseButton } from 'components/shared/ModalCloseButton';
import { withAuth } from 'hocs/withAuth';
import { withOrigin } from 'hocs/withOrigin';
import { useModal } from 'hooks/useModal';
import { useOrigin } from 'hooks/useOrigin';
import { UNEXPECTED_ERROR } from 'utils/constants';
import { dynamicApiRoutes, staticRoutes } from 'utils/router';
import type { PlausibleEvents } from 'types';

const OriginSettings: NextPage = () => {
  const { origin, setOrigin } = useOrigin();
  const { name: _name, apiKey = '', slug = '' } = origin ?? {};
  const [name, setName] = useState(_name);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittedText, setSubmittedText] = useState('');
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const { handleCloseModal, setModalContent } = useModal();
  const plausible = usePlausible<PlausibleEvents>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setSubmittedText('');
    setError('');

    try {
      const res = await fetch(dynamicApiRoutes.origin({ slug }), {
        method: 'PUT',
        body: JSON.stringify({ name }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { message, data } = await res.json();

      if (res.status === 200) {
        setOrigin(data);
        setError('');
        setSubmittedText('Origin settings saved.');
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
    handleCloseModal();
    setLoading(true);
    setSubmittedText('');
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

  const renderAlert = apiKeyCopied && (
    <div className="alert alert-success">
      <div className="flex">
        <label>API key copied to the clipboard!</label>
      </div>
      <div className="flex-none">
        <IconButton onClick={(): void => setApiKeyCopied(false)} icon={XIcon} />
      </div>
    </div>
  );

  const modalContent = (
    <>
      <div className="flex justify-end p-2">
        <ModalCloseButton />
      </div>
      <div className="p-4">
        <p>
          Are you sure you want to delete this origin? All data associated with it will be lost
          forever.
        </p>
      </div>
      <div className="p-2 grid grid-cols-2 gap-2">
        <Button className="btn-error btn-outline" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button className="btn-primary" onClick={handleConfirmDelete} autoFocus>
          Confirm
        </Button>
      </div>
    </>
  );

  const renderDeleteOriginLink = (
    <p
      onClick={(): void => setModalContent(modalContent)}
      className="mt-4 text-center link text-error"
    >
      Delete origin
    </p>
  );

  return (
    <MainTemplate>
      <Form
        title="Origin settings"
        onSubmit={handleSubmit}
        error={error}
        loading={loading}
        submittedText={submittedText}
        renderAlert={renderAlert}
        secondaryContent={renderDeleteOriginLink}
      >
        <Input
          name="name"
          label="Origin Name"
          helperText='E.g. "example.api.com" or "Internal REST API"'
          value={name}
          onChange={({ target }): void => setName(target.value)}
          required
        />
        <ApiKeyField value={apiKey} apiKeyCopiedCallback={(): void => setApiKeyCopied(false)} />
      </Form>
    </MainTemplate>
  );
};

export default withOrigin(withAuth(OriginSettings));
