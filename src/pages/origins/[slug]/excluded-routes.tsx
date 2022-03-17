import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import type { ChangeEvent, FormEvent } from 'react';

import { MainTemplate } from 'components/layout/MainTemplate';
import { BackButton } from 'components/shared/BackButton';
import { ConfirmModal } from 'components/shared/ConfirmModal';
import { Modal } from 'components/shared/Modal';
import { ModalCloseButton } from 'components/shared/ModalCloseButton';
import { RouteForm } from 'components/shared/RouteForm';
import { withAuth } from 'hocs/withAuth';
import { withOrigin } from 'hocs/withOrigin';
import { useOrigin } from 'hooks/useOrigin';
import { usePlausible } from 'hooks/usePlausible';
import { useUIState } from 'hooks/useUIState';
import { MODAL_NAMES, UNEXPECTED_ERROR } from 'utils/constants';
import { dynamicApiRoutes, dynamicRoutes } from 'utils/router';
import type { PlausibleEvents, RouteData } from 'types';

const OriginExcludedRoutes: NextPage = () => {
  const { slug, origin } = useOrigin();
  const [value, setValue] = useState('');
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);
  const plausible = usePlausible();

  const {
    loading,
    setLoading,
    setSuccessMessage,
    setErrorMessage,
    handleOpenModal,
    handleCloseModal: _handleCloseModal,
  } = useUIState();

  const handleCloseModal = (): void => {
    setSelectedRoute(null);
    setValue('');
    _handleCloseModal();
  };

  const updateRoutes = async ({
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
      const res = await fetch(dynamicApiRoutes.excludedRoutes({ slug }), {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { message, data } = await res.json();

      if (res.status === 200) {
        setRoutes(data);
        setValue('');
        handleCloseModal();
        setSuccessMessage(message);
        plausible(event);
      } else {
        setErrorMessage(message || UNEXPECTED_ERROR);
      }
    } catch {
      setErrorMessage(UNEXPECTED_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const validateRoute = (route: string): boolean | void => {
    // TODO: Improve the validation regex
    if (route.match(/^\/.*$/)) {
      return true;
    } else {
      setErrorMessage('Route must be a relative path.');
    }
  };

  const handleSubmitAddRoute = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (validateRoute(value)) {
      const payload = routes.map(({ route }) => route);
      payload.push(value);
      updateRoutes({ payload, event: 'add-excluded-route' });
    }
  };

  const handleSubmitUpdateRoute = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (validateRoute(value)) {
      const payload = routes.map(({ route }) => {
        if (route == selectedRoute?.route) {
          return value;
        }

        return route;
      });

      updateRoutes({ payload, event: 'update-excluded-route' });
    }
  };

  const handleConfirmDelete = (): void => {
    const payload = routes
      .map(({ route }) => route)
      .filter((route) => route !== selectedRoute?.route);

    updateRoutes({ payload, event: 'delete-excluded-route' });
  };

  const handleRouteClick = (route: RouteData) => (): void => {
    setSelectedRoute(route);
    setValue(route.route);
    handleOpenModal(MODAL_NAMES.EXCLUDED_ROUTE);
  };

  useEffect(() => {
    if (slug) {
      (async (): Promise<void> => {
        try {
          const res = await fetch(dynamicApiRoutes.excludedRoutes({ slug }));

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
    <div className="h-2 animate-pulse items-center rounded-lg bg-base-content" />
  );

  const renderDeleteLink = (
    <p
      onClick={(): void => handleOpenModal(MODAL_NAMES.DELETE_EXCLUDED_ROUTE)}
      className="link mt-4 text-center text-error"
    >
      Delete route
    </p>
  );

  const formProps = {
    value,
    onInputChange: ({ target }: ChangeEvent<HTMLInputElement>): void => setValue(target.value),
    helperText: (
      <>
        The route pattern should be a relative path and it can contain wildcards in the following
        format:
        <br />
        <code>{`/foo/<id>/bar`}</code>, where <code>{`<param>`}</code> placeholders indicate dynamic
        values.
      </>
    ),
  };

  const renderRoutes = (
    <div className="card rounded-lg bg-base-100 p-4 shadow">
      <BackButton linkTo={dynamicRoutes.origin({ slug })} text="Dashboard" />
      <h5 className="text-white">Excluded routes for {origin?.name}</h5>
      {loading ? (
        <div className="mt-2 flex flex-col gap-3">
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
            <p className="text-white">You have no excluded routes. Add your first route below.</p>
          )}
          <p className="mt-4 text-sm">
            All routes matching these patterns will be ignored from your metrics.
            <br />
            The number after the route indicates how many paths of your existing metrics are
            matching the given route.
          </p>
        </div>
      )}
      <RouteForm {...formProps} label="Add new excluded route" onSubmit={handleSubmitAddRoute} />
    </div>
  );

  const renderEditRouteModal = (
    <Modal name={MODAL_NAMES.EXCLUDED_ROUTE}>
      <div className="flex items-center justify-between p-2">
        <p className="px-2 font-bold">
          <p className="text-white">
            {selectedRoute?.route} ({selectedRoute?.matchingPaths})
          </p>
        </p>
        <ModalCloseButton onClick={handleCloseModal} />
      </div>
      <div className="p-4">
        <RouteForm
          {...formProps}
          label="Update route"
          onSubmit={handleSubmitUpdateRoute}
          contentAfter={renderDeleteLink}
        />
      </div>
    </Modal>
  );

  const renderDeleteRouteModal = (
    <ConfirmModal
      title="Delete route"
      name={MODAL_NAMES.DELETE_EXCLUDED_ROUTE}
      onConfirm={handleConfirmDelete}
      loading={loading}
      dangerAction
    >
      <p>
        Are you sure you want to delete <code>{selectedRoute?.route}</code>?
      </p>
    </ConfirmModal>
  );

  return (
    <MainTemplate
      headProps={{ title: origin?.name ? `Excluded routes for ${origin.name}` : 'Loading...' }}
    >
      {renderRoutes}
      {renderEditRouteModal}
      {renderDeleteRouteModal}
    </MainTemplate>
  );
};

export default withAuth(withOrigin(OriginExcludedRoutes));
