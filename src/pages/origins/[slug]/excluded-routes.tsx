import React, { useState } from 'react';
import type { NextPage } from 'next';
import type { FormEvent } from 'react';

import { OriginSettingsTemplate } from 'components/layout/OriginSettingsTemplate';
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
import { MODAL_NAMES, ORIGIN_MENU_KEYS } from 'utils/constants';
import { dynamicApiRoutes } from 'utils/router';
import type { PlausibleEvents, RouteData } from 'types';

const initialFormValues = {
  routeName: '',
};

const OriginExcludedRoutes: NextPage = () => {
  const plausible = usePlausible();
  const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);

  const {
    slug,
    origin,
    handleOpenModal,
    handleCloseModal: _handleCloseModal,
    setErrorMessage,
  } = useContext();

  const url = slug ? dynamicApiRoutes.excludedRoutes({ slug }) : undefined;
  const { data: routes = [], setData: setRoutes, loading } = useFetch<RouteData[]>({ url });

  const {
    formValues: { routeName },
    setFormValues,
    onInputChange,
    submitForm,
    submitting,
  } = useForm(initialFormValues);

  const handleCloseModal = (): void => {
    setSelectedRoute(null);
    setFormValues(initialFormValues);
    _handleCloseModal();
  };

  const updateRoutes = async ({
    payload,
    event,
  }: {
    payload: string[];
    event: keyof PlausibleEvents;
  }): Promise<void> => {
    submitForm<RouteData[]>({
      url: dynamicApiRoutes.excludedRoutes({ slug }),
      options: {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      },
      successCallback: ({ data }) => {
        setRoutes(data);
        handleCloseModal();
        plausible(event);
      },
    });
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

    if (validateRoute(routeName)) {
      const payload = routes.map(({ route }) => route);
      payload.push(routeName);
      updateRoutes({ payload, event: 'add-excluded-route' });
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
    setFormValues({ routeName: route.route });
    handleOpenModal(MODAL_NAMES.EXCLUDED_ROUTE);
  };

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
    routeName,
    onInputChange,
    submitting,
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
    <>
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
    </>
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
      submitting={submitting}
      dangerAction
    >
      <p>
        Are you sure you want to delete <code>{selectedRoute?.route}</code>?
      </p>
    </ConfirmModal>
  );

  return (
    <OriginSettingsTemplate
      headProps={{ title: origin?.name ? `Excluded routes for ${origin.name}` : 'Loading...' }}
      activeItem={ORIGIN_MENU_KEYS.EXCLUDED_ROUTES}
    >
      {renderRoutes}
      {renderEditRouteModal}
      {renderDeleteRouteModal}
    </OriginSettingsTemplate>
  );
};

export default withAuth(withOrigin(OriginExcludedRoutes));
