import Link from 'next/link';
import React from 'react';
import type { NextPage } from 'next';

import { DashboardOptions } from 'components/dashboard/DashboardOptions';
import { EndpointMetrics } from 'components/dashboard/EndpointMetrics';
import { GeoLocationMetrics } from 'components/dashboard/GeoLocationMetrics';
import { PercentileMetrics } from 'components/dashboard/PercentileMetrics';
import { StatusCodeMetrics } from 'components/dashboard/StatusCodeMetrics';
import { TimeFrameMetrics } from 'components/dashboard/TimeFrameMetrics';
import { UserAgentMetrics } from 'components/dashboard/UserAgentMetrics';
import { Layout } from 'components/layout/Layout';
import { Button } from 'components/shared/Button';
import { EmailListForm } from 'components/shared/EmailListForm';
import { useContext } from 'hooks/useContext';
import { useDashboardQuery } from 'hooks/useDashboardQuery';
import { usePlausible } from 'hooks/usePlausible';
import { EVENT_LOCATIONS, MOCK_ORIGIN } from 'utils/constants';
import { getMockMetrics } from 'utils/metrics';
import { staticRoutes } from 'utils/router';

const Demo: NextPage = () => {
  useDashboardQuery();
  const plausible = usePlausible();
  const eventOptions = { location: EVENT_LOCATIONS.PAGE_BOTTOM };
  const maxWidth = 'max-w-6xl';

  const {
    intervalDays,
    selectedMethod: method,
    selectedEndpoint: endpoint,
    selectedStatusCode: statusCode,
    selectedBrowser: browser,
    selectedOs: os,
    selectedDevice: device,
    selectedCountry: country,
    selectedRegion: region,
    selectedCity: city,
    setOrigin,
  } = useContext();

  setOrigin(MOCK_ORIGIN);

  const {
    generalData,
    timeFrameData,
    endpointData,
    percentileData,
    statusCodeData,
    userAgentData,
    geoLocationData,
  } = getMockMetrics({
    intervalDays,
    method,
    endpoint,
    statusCode,
    browser,
    os,
    device,
    country,
    region,
    city,
  });

  return (
    <Layout
      headProps={{
        title: 'Demo',
        description:
          'The Apilytics live demo shows you what kind of metrics you can analyze from your APIs using our service.',
        indexable: true,
      }}
      headerProps={{ maxWidth }}
      footerProps={{ maxWidth }}
    >
      <div className="container flex max-w-6xl grow flex-col py-4">
        <DashboardOptions />
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
          metrics.
        </p>
        <div className="py-4 sm:py-8">
          <div className="flex flex-col gap-8 sm:flex-row">
            <div className="grow">
              <h3 className="text-white">Would you like to see these metrics from your APIs?</h3>
              <h3 className="text-primary">Start a free trial now.</h3>
            </div>
            <div className="min-w-40 flex flex-col justify-center gap-2">
              <Button
                linkTo={staticRoutes.register}
                onClick={(): void => plausible('register-click', eventOptions)}
                className="btn-primary"
                fullWidth
              >
                Get started
              </Button>
              <Button
                linkTo={staticRoutes.root}
                onClick={(): void => plausible('live-demo-click', eventOptions)}
                className="btn-outline btn-secondary"
                fullWidth
              >
                Learn more
              </Button>
            </div>
          </div>
          <div className="mt-8">
            <EmailListForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Demo;
