import Router from 'next/router';
import React, { useState } from 'react';
import type { NextPage } from 'next';

import { MainTemplate } from 'components/layout/MainTemplate';
import { ApiKeyField } from 'components/shared/ApiKeyField';
import { BackButton } from 'components/shared/BackButton';
import { Button } from 'components/shared/Button';
import { Form } from 'components/shared/Form';
import { Input } from 'components/shared/Input';
import { Modal } from 'components/shared/Modal';
import { ModalCloseButton } from 'components/shared/ModalCloseButton';
import { withAuth } from 'hocs/withAuth';
import { withOrigin } from 'hocs/withOrigin';
import { useOrigin } from 'hooks/useOrigin';
import { usePlausible } from 'hooks/usePlausible';
import { useUIState } from 'hooks/useUIState';
import { MODAL_NAMES, UNEXPECTED_ERROR } from 'utils/constants';
import { dynamicApiRoutes, dynamicRoutes, staticRoutes } from 'utils/router';

const OriginSettings: NextPage = () => {
  const { origin, setOrigin } = useOrigin();
  const { name: _name, apiKey = '', slug = '' } = origin ?? {};
  const [name, setName] = useState(_name);
  const plausible = usePlausible();

  const { setLoading, setSuccessMessage, setErrorMessage, handleOpenModal, handleCloseModal } =
    useUIState();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await fetch(dynamicApiRoutes.origin({ slug }), {
        method: 'PATCH',
        body: JSON.stringify({ name }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { message, data } = await res.json();

      if (res.status === 200) {
        setOrigin(data);
        setErrorMessage('');
        setSuccessMessage(message);
        plausible('update-origin');
      } else {
        setErrorMessage(message || UNEXPECTED_ERROR);
      }
    } catch {
      setErrorMessage(UNEXPECTED_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async (): Promise<void> => {
    handleCloseModal();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await fetch(dynamicApiRoutes.origin({ slug }), {
        method: 'DELETE',
      });

      if (res.status === 204) {
        setErrorMessage('');
        plausible('delete-origin');
        Router.push(staticRoutes.origins);
      } else {
        const { message = UNEXPECTED_ERROR } = await res.json();
        setErrorMessage(message);
        setLoading(false);
      }
    } catch {
      setErrorMessage(UNEXPECTED_ERROR);
      setLoading(false);
    }
  };

  const renderDeleteOriginLink = (
    <p
      onClick={(): void => handleOpenModal(MODAL_NAMES.deleteOrigin)}
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
        >
          <Input
            name="name"
            label="Origin name"
            helperText='E.g. "example.api.com" or "Internal REST API"'
            value={name}
            onChange={({ target }): void => setName(target.value)}
            required
          />
          <ApiKeyField value={apiKey} />
          <div className="form-control mt-4">
            <Button
              linkTo={dynamicRoutes.originDynamicRoutes({ slug })}
              className="btn-outline btn-primary"
            >
              Dynamic routes
            </Button>
          </div>
          <Modal name={MODAL_NAMES.deleteOrigin}>
            <div className="flex justify-end p-2">
              <ModalCloseButton onClick={handleCloseModal} />
            </div>
            <div className="p-4">
              <p className="text-white">
                Are you sure you want to delete this origin?
                <br />
                All data associated with it will be lost forever.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 p-2">
              <Button className="btn-outline btn-primary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button className="btn-outline btn-error" onClick={handleConfirmDelete} autoFocus>
                Confirm
              </Button>
            </div>
          </Modal>
        </Form>
      </div>
    </MainTemplate>
  );
};

export default withAuth(withOrigin(OriginSettings));
