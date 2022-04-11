import React, { useState } from 'react';
import type { NextPage } from 'next';
import type { FormEvent } from 'react';

import { MainTemplate } from 'components/layout/MainTemplate';
import { BackButton } from 'components/shared/BackButton';
import { ConfirmModal } from 'components/shared/ConfirmModal';
import { Modal } from 'components/shared/Modal';
import { ModalCloseButton } from 'components/shared/ModalCloseButton';
import { RouteForm } from 'components/shared/RouteForm';
import { withAuth } from 'hocs/withAuth';
import { withOrigin } from 'hocs/withOrigin';
import { useContext } from 'hooks/useContext';
import { useFetch } from 'hooks/useFetch';
import { useForm } from 'hooks/useForm';
import { usePlausible } from 'hooks/usePlausible';
import { MODAL_NAMES } from 'utils/constants';
import { dynamicApiRoutes, dynamicRoutes } from 'utils/router';
import type { PlausibleEvents, RouteData } from 'types';

const initialFormValues = {
  routeName: '',
};

const OriginDynamicRoutes: NextPage = () => {
  const plausible = usePlausible();
  const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);

  const {
    slug,
    origin,
    handleOpenModal,
    handleCloseModal: _handleCloseModal,
    setErrorMessage,
  } = useContext();

  const {
    formValues: { routeName },
    setFormValues,
    onInputChange,
    submitForm,
  } = useForm(initialFormValues);

  const url = slug ? dynamicApiRoutes.dynamicRoutes({ slug }) : undefined;
  const { data: routes = [], setData: setRoutes, loading } = useFetch<RouteData[]>({ url });

  const handleCloseModal = (): void => {
    setSelectedRoute(null);
    setFormValues(initialFormValues);
    _handleCloseModal();
  };

  const updateRoutes = ({
    payload,
    event,
  }: {
    payload: string[];
    event: keyof PlausibleEvents;
  }): void => {
    const options = {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    submitForm<RouteData[]>({
      url: dynamicApiRoutes.dynamicRoutes({ slug }),
      options,
      successCallback: ({ data }): void => {
        setRoutes(data);
        handleCloseModal();
        plausible(event);
      },
    });
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

    if (validateRoute(routeName)) {
      const payload = routes.map(({ route }) => route);
      payload.push(routeName);
      updateRoutes({ payload, event: 'add-dynamic-route' });
    }
  };

  const handleSubmitUpdateRoute = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (validateRoute(routeName)) {
      const payload = routes.map(({ route }) => {
        if (route == selectedRoute?.route) {
          return routeName;
        }

        return route;
      });

      updateRoutes({ payload, event: 'update-dynamic-route' });
    }
  };

  const handleConfirmDelete = (): void => {
    const payload = routes
      .map(({ route }) => route)
      .filter((route) => route !== selectedRoute?.route);

    updateRoutes({ payload, event: 'delete-dynamic-route' });
  };

  const handleRouteClick = (route: RouteData) => (): void => {
    setSelectedRoute(route);
    setFormValues({ routeName: route.route });
    handleOpenModal(MODAL_NAMES.DYNAMIC_ROUTE);
  };

  const renderLoadingRow = (
    <div className="h-2 animate-pulse items-center rounded-lg bg-base-content" />
  );

  const renderDeleteLink = (
    <p
      onClick={(): void => handleOpenModal(MODAL_NAMES.DELETE_DYNAMIC_ROUTE)}
      className="link mt-4 text-center text-error"
    >
      Delete route
    </p>
  );

  const formProps = {
    routeName,
    onInputChange,
    loading,
    helperText: (
      <>
        The route pattern should be in the following kind format:
        <br />
        <code>{`/foo/<id>/bar`}</code>, where <code>{`<param>`}</code> placeholders indicate dynamic
        values.
      </>
    ),
  };

  const renderRoutes = (
    <div className="card rounded-lg bg-base-100 p-4 shadow">
      <BackButton linkTo={dynamicRoutes.origin({ slug })} text="Dashboard" />
      <h5 className="text-white">Dynamic routes for {origin?.name}</h5>
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
            <p className="text-white">You have no dynamic routes. Add your first route below.</p>
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
      <RouteForm {...formProps} label="Add new dynamic route" onSubmit={handleSubmitAddRoute} />
    </div>
  );

  const renderEditRouteModal = (
    <Modal name={MODAL_NAMES.DYNAMIC_ROUTE}>
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
      name={MODAL_NAMES.DELETE_DYNAMIC_ROUTE}
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
      headProps={{ title: origin?.name ? `Dynamic routes for ${origin.name}` : 'Loading...' }}
    >
      {renderRoutes}
      {renderEditRouteModal}
      {renderDeleteRouteModal}
    </MainTemplate>
  );
};

export default withAuth(withOrigin(OriginDynamicRoutes));
