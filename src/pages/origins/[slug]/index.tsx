import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import type { NextPage } from 'next';

import { DashboardOptions } from 'components/dashboard/DashboardOptions';
import { EndpointMetrics } from 'components/dashboard/EndpointMetrics';
import { GeoLocationMetrics } from 'components/dashboard/GeoLocationMetrics';
import { PercentileMetrics } from 'components/dashboard/PercentileMetrics';
import { StatusCodeMetrics } from 'components/dashboard/StatusCodeMetrics';
import { TimeFrameMetrics } from 'components/dashboard/TimeFrameMetrics';
import { UserAgentMetrics } from 'components/dashboard/UserAgentMetrics';
import { Layout } from 'components/layout/Layout';
import { NotFoundTemplate } from 'components/layout/NotFoundTemplate';
import { UIAlerts } from 'components/layout/UIAlerts';
import { ApiKeyField } from 'components/shared/ApiKeyField';
import { BackButton } from 'components/shared/BackButton';
import { Modal } from 'components/shared/Modal';
import { ModalCloseButton } from 'components/shared/ModalCloseButton';
import { withAuth } from 'hocs/withAuth';
import { withOrigin } from 'hocs/withOrigin';
import { useContext } from 'hooks/useContext';
import { useDashboardQuery } from 'hooks/useDashboardQuery';
import { useFetch } from 'hooks/useFetch';
import { MODAL_NAMES } from 'utils/constants';
import { dynamicApiRoutes, staticRoutes } from 'utils/router';
import type { OriginMetrics } from 'types';

const Origin: NextPage = () => {
  const {
    slug,
    showApiKey,
    origin,
    intervalDays,
    selectedMethod: method = '',
    setSelectedMethod,
    selectedEndpoint: endpoint = '',
    setSelectedEndpoint,
    selectedStatusCode: statusCode = '',
    setSelectedStatusCode,
    selectedBrowser: browser = '',
    setSelectedBrowser,
    selectedOs: os = '',
    setSelectedOs,
    selectedDevice: device = '',
    setSelectedDevice,
    selectedCountry: country = '',
    setSelectedCountry,
    selectedRegion: region = '',
    setSelectedRegion,
    selectedCity: city = '',
    setSelectedCity,
  } = useContext();

  const { data: metrics, loading, notFound, fetcher: fetchMetrics } = useFetch<OriginMetrics>();
  const { handleOpenModal, handleCloseModal } = useContext();
  const { pathname, query, replace } = useRouter();
  const apiKey = origin?.apiKey ?? '';
  const maxWidth = 'max-w-6xl';

  useDashboardQuery(true);

  useEffect(() => {
    if (slug && intervalDays) {
      const url = dynamicApiRoutes.originMetrics({
        slug,
        'interval-days': intervalDays,
        method,
        endpoint,
        'status-code': statusCode,
        browser,
        os,
        device,
        country,
        region,
        city,
      });

      fetchMetrics({ url });
    }
  }, [
    endpoint,
    method,
    slug,
    statusCode,
    intervalDays,
    browser,
    os,
    device,
    country,
    region,
    city,
    fetchMetrics,
  ]);

  useEffect(() => {
    if (showApiKey) {
      handleOpenModal(MODAL_NAMES.API_KEY);
      delete query.showApiKey;
      replace({ pathname, query });
    }
  }, [handleOpenModal, pathname, query, replace, showApiKey]);

  // Reset filters when exiting the page.
  useEffect(() => {
    return (): void => {
      setSelectedMethod(undefined);
      setSelectedEndpoint(undefined);
      setSelectedStatusCode(undefined);
      setSelectedBrowser(undefined);
      setSelectedOs(undefined);
      setSelectedDevice(undefined);
      setSelectedCountry(undefined);
      setSelectedRegion(undefined);
      setSelectedCity(undefined);
    };
  }, [
    setSelectedBrowser,
    setSelectedCity,
    setSelectedCountry,
    setSelectedDevice,
    setSelectedEndpoint,
    setSelectedMethod,
    setSelectedOs,
    setSelectedRegion,
    setSelectedStatusCode,
  ]);

  if (notFound) {
    return <NotFoundTemplate />;
  }

  if (loading || !origin || !metrics) {
    return (
      <Layout
        headProps={{ title: origin?.name ?? 'Loading...' }}
        headerProps={{ maxWidth }}
        footerProps={{ maxWidth }}
      >
        <div className="container flex max-w-6xl grow flex-col py-4">
          <BackButton
            linkTo={staticRoutes.origins}
            text="Origins"
            className="btn-sm hidden sm:flex"
          />
          {origin ? (
            <DashboardOptions />
          ) : (
            <div className="my-4 flex animate-pulse flex-wrap gap-2">
              <div className="h-4 w-36 rounded-lg bg-base-100" />
              <div className="ml-auto h-4 w-24 rounded-lg bg-base-100" />
              <div className="h-4 w-4 rounded-lg bg-base-100" />
            </div>
          )}
          <div className="flex animate-pulse flex-col rounded-lg border-2 border-base-content">
            <div className="flex">
              <div className="flex flex-col gap-2 p-4">
                <div className="h-4 w-24 rounded-lg bg-base-100" />
                <div className="h-2 w-16 rounded-lg bg-base-100" />
              </div>
              <div className="flex flex-col gap-2 p-4">
                <div className="h-4 w-24 rounded-lg bg-base-100" />
                <div className="h-2 w-16 rounded-lg bg-base-100" />
              </div>
              <div className="flex flex-col gap-2 p-4">
                <div className="h-4 w-24 rounded-lg bg-base-100" />
                <div className="h-2 w-16 rounded-lg bg-base-100" />
              </div>
              <div className="ml-auto flex gap-2 p-4">
                <div className="h-4 w-16 rounded-lg bg-base-100" />
                <div className="h-4 w-16 rounded-lg bg-base-100" />
                <div className="h-4 w-16 rounded-lg bg-base-100" />
              </div>
            </div>
            <div className="flex h-96 items-end justify-evenly gap-2 p-4">
              <div className="h-1/6 w-full rounded-lg bg-base-100" />
              <div className="h-2/6 w-full rounded-lg bg-base-100" />
              <div className="h-1/6 w-full rounded-lg bg-base-100" />
              <div className="h-2/6 w-full rounded-lg bg-base-100" />
              <div className="h-3/6 w-full rounded-lg bg-base-100" />
              <div className="h-4/6 w-full rounded-lg bg-base-100" />
              <div className="h-3/6 w-full rounded-lg bg-base-100" />
              <div className="h-2/6 w-full rounded-lg bg-base-100" />
              <div className="h-3/6 w-full rounded-lg bg-base-100" />
              <div className="h-4/6 w-full rounded-lg bg-base-100" />
              <div className="h-5/6 w-full rounded-lg bg-base-100" />
              <div className="h-full w-full rounded-lg bg-base-100" />
            </div>
          </div>
          <div className="mt-4 flex h-96 animate-pulse flex-col rounded-lg border-2 border-base-content">
            <div className="flex flex-wrap p-4">
              <div className="mr-auto h-4 w-24 rounded-lg bg-base-100" />
              <div className="flex flex-wrap gap-2">
                <div className="h-4 w-14 rounded-lg bg-base-100" />
                <div className="h-4 w-14 rounded-lg bg-base-100" />
              </div>
            </div>
            <div className="flex grow flex-col justify-evenly gap-2 p-4">
              <div className="h-full w-full rounded-lg bg-base-100" />
              <div className="h-full w-5/6 rounded-lg bg-base-100" />
              <div className="h-full w-4/6 rounded-lg bg-base-100" />
              <div className="h-full w-3/6 rounded-lg bg-base-100" />
              <div className="h-full w-2/6 rounded-lg bg-base-100" />
              <div className="h-full w-1/6 rounded-lg bg-base-100" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const {
    generalData,
    timeFrameData,
    endpointData,
    percentileData,
    statusCodeData,
    userAgentData,
    geoLocationData,
  } = metrics;

  return (
    <Layout
      headProps={{ title: origin.name }}
      headerProps={{ maxWidth }}
      footerProps={{ maxWidth }}
    >
      <div className="container flex max-w-6xl grow flex-col py-4">
        <UIAlerts />
        <BackButton
          linkTo={staticRoutes.origins}
          text="Origins"
          className="btn-sm hidden sm:flex"
        />
        <DashboardOptions apilyticsPackage={metrics.apilyticsPackage} />
        <TimeFrameMetrics {...generalData} data={timeFrameData} />
        <div className="mt-4">
          <EndpointMetrics data={endpointData} />
        </div>
        <div className="mt-4">
          <GeoLocationMetrics data={geoLocationData} />
        </div>
        <div className="mt-4">
          <PercentileMetrics data={percentileData} />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <StatusCodeMetrics data={statusCodeData} />
          <UserAgentMetrics data={userAgentData} />
        </div>
        <p className="mt-4">
          See our <Link href={staticRoutes.dashboard}>docs</Link> for more details about these
          metrics. Help us improve this dashboard by{' '}
          <Link href={staticRoutes.contact}>
            <a>giving us feedback</a>
          </Link>
          .
        </p>
        <Modal name={MODAL_NAMES.API_KEY}>
          <div className="flex items-center justify-between p-2">
            <h6 className="px-2 text-white">Almost ready!</h6>
            <ModalCloseButton onClick={handleCloseModal} />
          </div>
          <div className="px-4">
            <p>Finish configuration by setting up your API key.</p>
          </div>
          <div className="p-4">
            <ApiKeyField value={apiKey} onClickCallback={(): void => handleCloseModal()} />
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default withAuth(withOrigin(Origin));
