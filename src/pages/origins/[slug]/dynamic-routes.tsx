import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import type { FormEvent } from 'react';

import { MainTemplate } from 'components/layout/MainTemplate';
import { BackButton } from 'components/shared/BackButton';
import { Button } from 'components/shared/Button';
import { DynamicRouteForm } from 'components/shared/DynamicRouteForm';
import { Modal } from 'components/shared/Modal';
import { ModalCloseButton } from 'components/shared/ModalCloseButton';
import { withAuth } from 'hocs/withAuth';
import { withOrigin } from 'hocs/withOrigin';
import { useOrigin } from 'hooks/useOrigin';
import { usePlausible } from 'hooks/usePlausible';
import { useUIState } from 'hooks/useUIState';
import { MODAL_NAMES, UNEXPECTED_ERROR } from 'utils/constants';
import { dynamicApiRoutes, dynamicRoutes } from 'utils/router';
import type { DynamicRouteWithMatches, PlausibleEvents } from 'types';

const OriginDynamicRoutes: NextPage = () => {
  const { slug, origin } = useOrigin();
  const [newRouteValue, setNewRouteValue] = useState('');
  const [updateRouteValue, setUpdateRouteValue] = useState('');
  const [routes, setRoutes] = useState<DynamicRouteWithMatches[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<DynamicRouteWithMatches | null>(null);
  const plausible = usePlausible();

  const {
    loading,
    setLoading,
    setSuccessMessage,
    setErrorMessage,
    handleOpenModal,
    handleCloseModal,
  } = useUIState();

  const updateOrigins = async ({
    payload,
    event,
  }: {
    payload: string[];
    event: keyof PlausibleEvents;
  }): Promise<void> => {
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await fetch(dynamicApiRoutes.dynamicRoutes({ slug }), {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { message = UNEXPECTED_ERROR, data } = await res.json();

      if (res.status === 200) {
        setRoutes(data);
        setErrorMessage('');
        setNewRouteValue('');
        setUpdateRouteValue('');
        setSelectedRoute(null);
        handleCloseModal();
        setSuccessMessage('Dynamic routes updated.');
        plausible(event);
      } else {
        setErrorMessage(message);
      }
    } catch {
      setErrorMessage(UNEXPECTED_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const validateRoute = (route: string): boolean | void => {
    if (route.match(/^\/.*<[a-z_-]+>.*$/)) {
      return true;
    } else {
      setErrorMessage('Route must be a relative path with at least one dynamic style placeholder.');
    }
  };

  const handleSubmitAddRoute = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (validateRoute(newRouteValue)) {
      const payload = routes.map(({ route }) => route);
      payload.push(newRouteValue);
      updateOrigins({ payload, event: 'add-dynamic-route' });
    }
  };

  const handleSubmitUpdateRoute = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (validateRoute(updateRouteValue)) {
      const payload = routes.map(({ route }) => {
        if (route == selectedRoute?.route) {
          return updateRouteValue;
        }

        return route;
      });

      updateOrigins({ payload, event: 'update-dynamic-route' });
    }
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
    setSuccessMessage('');
  };

  useEffect(() => {
    if (slug) {
      (async (): Promise<void> => {
        try {
          const res = await fetch(dynamicApiRoutes.dynamicRoutes({ slug }));

          if (res.status === 200) {
            const { data } = await res.json();
            setRoutes(data);
          }
        } catch {
          setErrorMessage(UNEXPECTED_ERROR);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [setErrorMessage, setLoading, slug]);

  const renderLoadingRow = (
    <div className="flex h-5 animate-pulse items-center rounded-lg border-2 border-base-content p-1">
      <div className="h-full w-full rounded-lg bg-base-200" />
    </div>
  );

  const renderDeleteLink = (
    <p
      onClick={(): void => handleOpenModal(MODAL_NAMES.deleteDynamicRoute)}
      className="link mt-4 text-center text-error"
    >
      Delete route
    </p>
  );

  const renderDynamicRouteForm = (
    <div className="card rounded-lg bg-base-100 p-4 shadow">
      <BackButton linkTo={dynamicRoutes.origin({ slug })} text="Dashboard" />
      <h5 className="text-white">Dynamic routes for {origin?.name}</h5>
      {loading ? (
        <div className="mt-2 flex flex-col gap-2">
          {renderLoadingRow}
          {renderLoadingRow}
          {renderLoadingRow}
          {renderLoadingRow}
          {renderLoadingRow}
        </div>
      ) : (
        <div className="mt-2 flex flex-col items-start">
          {routes.length ? (
            routes.map((route) => (
              <p key={route.route}>
                <a onClick={handleRouteClick(route)}>{route.route}</a> ({route.matchingPaths})
              </p>
            ))
          ) : (
            <p className="text-white">No routes. Add your first dynamic route below.</p>
          )}
          <p className="mt-4 text-sm">
            All routes matching these patterns will be grouped into single endpoints by their HTTP
            methods.
            <br />
            The number after the route indicates how many paths of your existing metrics are
            matching the given route.
          </p>
        </div>
      )}
      <DynamicRouteForm
        label="Add new route"
        value={newRouteValue}
        onInputChange={({ target }): void => setNewRouteValue(target.value)}
        onSubmit={handleSubmitAddRoute}
      />
    </div>
  );

  const renderEditDynamicRouteModal = (
    <Modal name={MODAL_NAMES.dynamicRoute}>
      <div className="flex items-center justify-between p-2">
        <p className="px-2 font-bold">
          <p className="text-white">
            {selectedRoute?.route} ({selectedRoute?.matchingPaths})
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
        />
      </div>
    </Modal>
  );

  const renderDeleteDynamicRouteModal = (
    <Modal name={MODAL_NAMES.deleteDynamicRoute}>
      <div className="flex items-center justify-between p-2">
        <p className="px-2 font-bold">
          <p className="text-white">Delete route</p>
        </p>
        <ModalCloseButton onClick={handleCloseModal} />
      </div>
      <div className="p-4">
        <p>
          Are you sure you want to delete dynamic route <code>{selectedRoute?.route}</code>?
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 p-2">
        <Button className="btn-outline btn-error" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button className="btn-primary" onClick={handleConfirmDelete} autoFocus>
          Confirm
        </Button>
      </div>
    </Modal>
  );

  return (
    <MainTemplate
      headProps={{ title: origin?.name ? `Dynamic routes for ${origin.name}` : 'Loading...' }}
    >
      {renderDynamicRouteForm}
      {renderEditDynamicRouteModal}
      {renderDeleteDynamicRouteModal}
    </MainTemplate>
  );
};

export default withAuth(withOrigin(OriginDynamicRoutes));
