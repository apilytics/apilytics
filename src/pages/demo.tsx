import Link from 'next/link';
import React, { useState } from 'react';
import type { NextPage } from 'next';

import { DashboardOptions } from 'components/dashboard/DashboardOptions';
import { RequestsOverview } from 'components/dashboard/RequestsOverview';
import { ResponseTimes } from 'components/dashboard/ResponseTimes';
import { RouteMetrics } from 'components/dashboard/RouteMetrics';
import { MainTemplate } from 'components/layout/MainTemplate';
import { Button } from 'components/shared/Button';
import { MOCK_METRICS, MOCK_ORIGIN } from 'mocks';
import { LAST_7_DAYS_VALUE } from 'utils/constants';
import { staticRoutes } from 'utils/router';
import type { TimeFrame } from 'types';

const Demo: NextPage = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>(LAST_7_DAYS_VALUE);
  const origin = MOCK_ORIGIN;
  const metrics = MOCK_METRICS[timeFrame];
  const loading = !origin || !metrics;

  return (
    <MainTemplate wide>
      <DashboardOptions
        timeFrame={timeFrame}
        setTimeFrame={setTimeFrame}
        origin={origin}
        hideSettingsButton
      />
      <RequestsOverview timeFrame={timeFrame} origin={origin} metrics={metrics} loading={loading} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 grow">
        <RouteMetrics metrics={metrics} loading={loading} />
        <ResponseTimes metrics={metrics} loading={loading} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 items-center">
        <div>
          <h2 className="text-3xl">
            Want to see these metrics from your APIs?{' '}
            <span className="text-primary">Start for free now.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Link href={staticRoutes.login} passHref>
            <Button fullWidth="mobile">Get started</Button>
          </Link>
          <Link href={staticRoutes.root} passHref>
            <Button colorClass="btn-secondary" variantClass="btn-outline" fullWidth="mobile">
              Learn more
            </Button>
          </Link>
        </div>
      </div>
    </MainTemplate>
  );
};

export default Demo;
