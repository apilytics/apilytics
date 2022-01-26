import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import type { FormEvent } from 'react';

import { LoadingTemplate } from 'components/layout/LoadingTemplate';
import { MainTemplate } from 'components/layout/MainTemplate';
import { BackButton } from 'components/shared/BackButton';
import { Button } from 'components/shared/Button';
import { DynamicRouteForm } from 'components/shared/DynamicRouteForm';
import { Modal } from 'components/shared/Modal';
import { ModalCloseButton } from 'components/shared/ModalCloseButton';
import { withAuth } from 'hocs/withAuth';
import { withOrigin } from 'hocs/withOrigin';
import { useModal } from 'hooks/useModal';
import { useOrigin } from 'hooks/useOrigin';
import { usePlausible } from 'hooks/usePlausible';
import { MODAL_NAMES, UNEXPECTED_ERROR } from 'utils/constants';
import { dynamicApiRoutes, dynamicRoutes } from 'utils/router';
import type { DynamicRouteWithMatches, PlausibleEvents } from 'types';

const OriginDynamicRoutes: NextPage = () => {
  const { origin } = useOrigin();
  const slug = origin?.slug || '';
  const [newRouteValue, setNewRouteValue] = useState('');
  const [updateRouteValue, setUpdateRouteValue] = useState('');
  const [routes, setRoutes] = useState<DynamicRouteWithMatches[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittedText, setSubmittedText] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<DynamicRouteWithMatches | null>(null);
  const { handleOpenModal, handleCloseModal } = useModal();
  const plausible = usePlausible();

  const updateOrigins = async ({
    payload,
    event,
  }: {
    payload: string[];
    event: keyof PlausibleEvents;
  }): Promise<void> => {
    setLoading(true);
    setSubmittedText('');
    setError('');

    try {
      const res = await fetch(dynamicApiRoutes.dynamicRoutes({ slug }), {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { message, data } = await res.json();

      if (res.status === 200) {
        setRoutes(data);
        setError('');
        setNewRouteValue('');
        setUpdateRouteValue('');
        setSelectedRoute(null);
        handleCloseModal();
        setSubmittedText('Dynamic routes updated.');
        plausible(event);
      } else {
        setError(message || UNEXPECTED_ERROR);
      }
    } catch {
      setError(UNEXPECTED_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAddRoute = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const payload = routes.map(({ route }) => route);
    payload.push(newRouteValue);
    console.log('payload', payload);
    updateOrigins({ payload, event: 'add-dynamic-route' });
  };

  const handleSubmitUpdateRoute = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const payload = routes.map(({ route }) => {
      if (route == selectedRoute?.route) {
        return updateRouteValue;
      }

      return route;
    });

    updateOrigins({ payload, event: 'update-dynamic-route' });
  };

  const handleConfirmDelete = (): void => {
    const payload = routes
      .map(({ route }) => route)
      .filter((route) => route !== selectedRoute?.route);

    updateOrigins({ payload, event: 'delete-dynamic-route' });
  };

  const handleRouteClick = (route: DynamicRouteWithMatches) => (): void => {
    setSelectedRoute(route);
    setUpdateRouteValue(route.route);
    handleOpenModal(MODAL_NAMES.dynamicRoute);
    setSubmittedText('');
  };

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const res = await fetch(dynamicApiRoutes.dynamicRoutes({ slug }));
        const { data } = await res.json();
        setRoutes(data);
      } catch {
        setError(UNEXPECTED_ERROR);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return <LoadingTemplate />;
  }

  const formProps = {
    error,
    submittedText,
    loading,
  };

  const renderDeleteLink = (
    <p
      onClick={(): void => handleOpenModal(MODAL_NAMES.deleteDynamicRoute)}
      className="mt-4 text-center link text-error"
    >
      Delete route
    </p>
  );

  return (
    <MainTemplate headProps={{ title: 'Dynamic routes' }}>
      <div className="card rounded-lg p-4 shadow bg-base-100">
        <BackButton linkTo={dynamicRoutes.origin({ slug })} text="Dashboard" />
        <h5 className="text-white">Dynamic routes for {origin?.name}</h5>
        <div className="mt-2 flex flex-col items-start">
          {routes.map((route) => (
            <p key={route.route}>
              <a onClick={handleRouteClick(route)}>{route.route}</a> ({route.matching_paths})
            </p>
          ))}
          <p className="text-sm mt-4">
            All routes matching these patterns will be grouped into single endpoints by their HTTP
            methods.
            <br />
            The number after the route indicates how many paths of your existing metrics are
            matching the given route.
          </p>
        </div>
        <DynamicRouteForm
          label="Add new route"
          value={newRouteValue}
          onInputChange={({ target }): void => setNewRouteValue(target.value)}
          onSubmit={handleSubmitAddRoute}
          {...formProps}
        />
      </div>
      <Modal name={MODAL_NAMES.dynamicRoute}>
        <div className="flex justify-between items-center p-2">
          <p className="font-bold px-2">
            <p className="text-white">
              {selectedRoute?.route} ({selectedRoute?.matching_paths})
            </p>
          </p>
          <ModalCloseButton onClick={handleCloseModal} />
        </div>
        <div className="p-4">
          <DynamicRouteForm
            label="Update route"
            value={updateRouteValue}
            onInputChange={({ target }): void => setUpdateRouteValue(target.value)}
            onSubmit={handleSubmitUpdateRoute}
            contentAfter={renderDeleteLink}
            {...formProps}
          />
        </div>
      </Modal>
      <Modal name={MODAL_NAMES.deleteDynamicRoute}>
        <div className="flex justify-end p-2">
          <ModalCloseButton onClick={handleCloseModal} />
        </div>
        <div className="p-4 text-white">
          <p>Are you sure you want to delete this dynamic route?</p>
        </div>
        <div className="p-2 grid grid-cols-2 gap-2">
          <Button className="btn-error btn-outline" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button className="btn-primary" onClick={handleConfirmDelete} autoFocus>
            Confirm
          </Button>
        </div>
      </Modal>
    </MainTemplate>
  );
};

export default withOrigin(withAuth(OriginDynamicRoutes));
