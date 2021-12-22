import Link from 'next/link';
import React, { useState } from 'react';
import type { NextPage } from 'next';

import {
  Button,
  DashboardOptions,
  Layout,
  RequestsOverview,
  ResponseTimes,
  RouteMetrics,
} from 'components';
import { LAST_7_DAYS_VALUE, mockApi, routes } from 'utils';
import type { TimeFrame } from 'types';

const Demo: NextPage = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>(LAST_7_DAYS_VALUE);
  const { sources = [] } = mockApi(timeFrame);
  const [sourceName, setSourceName] = useState(sources[0].name);

  const {
    totalRequests = 0,
    totalRequestsGrowth = 0,
    requestsData = [],
    routesData = [],
  } = sources.find((source) => source.name === sourceName) || {};

  return (
    <Layout noIndex headerMaxWidth="5xl">
      <div className="bg-background bg-no-repeat bg-cover">
        <div className="bg-filter">
          <div className="container max-w-5xl py-16 animate-fade-in-top animation-delay-400">
            <DashboardOptions
              sourceName={sourceName}
              setSourceName={setSourceName}
              sources={sources}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div>
                <h2 className="text-3xl text-white">
                  Want to see these metrics from your APIs?{' '}
                  <span className="text-primary">Start for free now.</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href={routes.signUp} passHref>
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
