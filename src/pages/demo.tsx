import Link from 'next/link';
import React, { useState } from 'react';
import type { NextPage } from 'next';

import { DashboardOptions } from 'components/Demo/DashboardOptions';
import { RequestsOverview } from 'components/Demo/RequestsOverview';
import { ResponseTimes } from 'components/Demo/ResponseTimes';
import { RouteMetrics } from 'components/Demo/RouteMetrics';
import { Layout } from 'components/layout/Layout';
import { Button } from 'components/shared/Button';
import { LAST_7_DAYS_VALUE } from 'utils/constants';
import { mockApi } from 'utils/mockApi';
import { routes } from 'utils/router';
import type { TimeFrame } from 'types';

const Demo: NextPage = () => {
  const [selectedSource, setSelectedSource] = useState('');
  const [timeFrame, setTimeFrame] = useState<TimeFrame>(LAST_7_DAYS_VALUE);

  const {
    sourceOptions,
    totalRequests = 0,
    totalRequestsGrowth = 0,
    requestsData = [],
    routesData = [],
  } = mockApi({ source: selectedSource, timeFrame });

  return (
    <Layout noIndex headerMaxWidth="5xl">
      <div className="bg-background bg-no-repeat bg-cover">
        <div className="bg-filter">
          <div className="container max-w-5xl py-16 animate-fade-in-top animation-delay-400">
            <DashboardOptions
              selectedSource={selectedSource}
              setSelectedSource={setSelectedSource}
              sourceOptions={sourceOptions}
              timeFrame={timeFrame}
              setTimeFrame={setTimeFrame}
            />
            <RequestsOverview
              timeFrame={timeFrame}
              totalRequests={totalRequests}
              totalRequestsGrowth={totalRequestsGrowth}
              requestsData={requestsData}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <RouteMetrics routesData={routesData} />
              <ResponseTimes routesData={routesData} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 items-center">
              <div>
                <h2 className="text-3xl text-white">
                  Want to see these metrics from your APIs?{' '}
                  <span className="text-primary">Start for free now.</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href={routes.login} passHref>
                  <Button>Get started</Button>
                </Link>
                <Link href={routes.root} passHref>
                  <Button variant="secondary">Learn more</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Demo;
