import Link from 'next/link';
import React from 'react';
import type { NextPage } from 'next';

import { DashboardOptions } from 'components/dashboard/DashboardOptions';
import { EndpointMetrics } from 'components/dashboard/EndpointMetrics';
import { PercentileMetrics } from 'components/dashboard/PercentileMetrics';
import { StatusCodeMetrics } from 'components/dashboard/StatusCodeMetrics';
import { TimeFrameMetrics } from 'components/dashboard/TimeFrameMetrics';
import { UserAgentMetrics } from 'components/dashboard/UserAgentMetrics';
import { Layout } from 'components/layout/Layout';
import { Button } from 'components/shared/Button';
import { EmailListForm } from 'components/shared/EmailListForm';
import { withNoAuth } from 'hocs/withNoAuth';
import { useDashboardQuery } from 'hooks/useDashboardQuery';
import { useOrigin } from 'hooks/useOrigin';
import { usePlausible } from 'hooks/usePlausible';
import { EVENT_LOCATIONS, MOCK_ORIGIN } from 'utils/constants';
import { getMockMetrics } from 'utils/metrics';
import { staticRoutes } from 'utils/router';

const Demo: NextPage = () => {
  useDashboardQuery();
  const plausible = usePlausible();
  const origin = MOCK_ORIGIN;
  const eventOptions = { location: EVENT_LOCATIONS.PAGE_BOTTOM };
  const maxWidth = 'max-w-6xl';

  const {
    timeFrame,
    selectedMethod: method,
    selectedEndpoint: endpoint,
    selectedStatusCode: statusCode,
    selectedBrowser: browser,
    selectedOs: os,
    selectedDevice: device,
  } = useOrigin();

  const {
    generalData,
    timeFrameData,
    endpointData,
    percentileData,
    statusCodeData,
    userAgentData,
  } = getMockMetrics({
    timeFrame,
    method,
    endpoint,
    statusCode,
    browser,
    os,
    device,
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
      <div className="container py-4 max-w-6xl grow flex flex-col">
        <DashboardOptions origin={origin} />
        <TimeFrameMetrics {...generalData} data={timeFrameData} />
        <div className="mt-4">
          <EndpointMetrics data={endpointData} />
        </div>
        <div className="mt-4">
          <PercentileMetrics data={percentileData} />
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatusCodeMetrics data={statusCodeData} />
          <UserAgentMetrics data={userAgentData} />
        </div>
        <p className="mt-4">
          See our <Link href={staticRoutes.dashboard}>docs</Link> for more details about these
          metrics.
        </p>
        <div className="py-4 sm:py-8">
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="grow">
              <h3 className="text-white">Would you like to see these metrics from your APIs?</h3>
              <h3 className="text-primary">Start a free trial now.</h3>
            </div>
            <div className="flex flex-col justify-center gap-2 min-w-40">
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
                className="btn-secondary btn-outline"
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

export default withNoAuth(Demo);
