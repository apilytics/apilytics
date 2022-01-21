import React, { useState } from 'react';
import type { NextPage } from 'next';

import { DashboardOptions } from 'components/dashboard/DashboardOptions';
import { EndpointRequests } from 'components/dashboard/EndpointRequests';
import { EndpointResponseTimes } from 'components/dashboard/EndpointResponseTimes';
import { RequestsTimeFrame } from 'components/dashboard/RequestsTimeFrame';
import { MainTemplate } from 'components/layout/MainTemplate';
import { Button } from 'components/shared/Button';
import { withNoAuth } from 'hocs/withNoAuth';
import { MOCK_ORIGIN, WEEK_DAYS } from 'utils/constants';
import { getMockMetrics } from 'utils/metrics';
import { staticRoutes } from 'utils/router';
import type { EndpointData, TimeFrame } from 'types';

const Demo: NextPage = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>(WEEK_DAYS);
  const origin = MOCK_ORIGIN;
  const [metrics] = useState(() => getMockMetrics(timeFrame));
  const loading = !origin || !metrics;
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointData | null>(null);

  return (
    <MainTemplate
      maxWidth="max-w-6xl"
      dense
      indexable
      title="Demo"
      description="The Apilytics live demo shows you what kind of metrics you can analyze from your APIs using our service."
    >
      <DashboardOptions
        timeFrame={timeFrame}
        setTimeFrame={setTimeFrame}
        origin={origin}
        hideSettingsButton
      />
      <RequestsTimeFrame
        timeFrame={timeFrame}
        origin={origin}
        metrics={metrics}
        loading={loading}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 grow">
        <EndpointRequests
          metrics={metrics}
          loading={loading}
          selectedEndpoint={selectedEndpoint}
          setSelectedEndpoint={setSelectedEndpoint}
        />
        <EndpointResponseTimes
          metrics={metrics}
          loading={loading}
          selectedEndpoint={selectedEndpoint}
          setSelectedEndpoint={setSelectedEndpoint}
        />
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center mt-4">
        <div className="grow">
          <h4 className="text-white">
            Want to see these metrics from your APIs?
            <br />
            <span className="text-primary">Start for free now.</span>
          </h4>
        </div>
        <div className="flex flex-col lg:flex-row gap-4 mt-4 lg:mt-0">
          <Button linkTo={staticRoutes.login} className="btn-primary" fullWidth="mobile">
            Get started
          </Button>
          <Button
            linkTo={staticRoutes.root}
            className="btn-secondary btn-outline"
            fullWidth="mobile"
          >
            Learn more
          </Button>
        </div>
      </div>
    </MainTemplate>
  );
};

export default withNoAuth(Demo);
