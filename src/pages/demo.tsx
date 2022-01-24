import React, { useMemo, useState } from 'react';
import type { NextPage } from 'next';

import { DashboardOptions } from 'components/dashboard/DashboardOptions';
import { EndpointRequests } from 'components/dashboard/EndpointRequests';
import { EndpointResponseTimes } from 'components/dashboard/EndpointResponseTimes';
import { RequestsTimeFrame } from 'components/dashboard/RequestsTimeFrame';
import { MainTemplate } from 'components/layout/MainTemplate';
import { Button } from 'components/shared/Button';
import { EmailListForm } from 'components/shared/EmailListForm';
import { withNoAuth } from 'hocs/withNoAuth';
import { usePlausible } from 'hooks/usePlausible';
import { EVENT_LOCATIONS, MOCK_ORIGIN, WEEK_DAYS } from 'utils/constants';
import { getMockMetrics } from 'utils/metrics';
import { staticRoutes } from 'utils/router';
import type { TimeFrame } from 'types';

const Demo: NextPage = () => {
  const plausible = usePlausible();
  const [timeFrame, setTimeFrame] = useState<TimeFrame>(WEEK_DAYS);
  const origin = MOCK_ORIGIN;
  const metrics = useMemo(() => getMockMetrics(timeFrame), [timeFrame]);
  const loading = !origin || !metrics;
  const eventOptions = { location: EVENT_LOCATIONS.PAGE_BOTTOM };

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
          key={Math.random()} // Prevent label list from not showing on first render.
        />
        <EndpointResponseTimes
          metrics={metrics}
          loading={loading}
          key={Math.random()} // Prevent label list from not showing on first render.
        />
      </div>
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
    </MainTemplate>
  );
};

export default withNoAuth(Demo);
