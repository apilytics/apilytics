import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

import { DashboardOptions } from 'components/Demo/DashboardOptions';
import { RequestsOverview } from 'components/Demo/RequestsOverview';
import { ResponseTimes } from 'components/Demo/ResponseTimes';
import { RouteMetrics } from 'components/Demo/RouteMetrics';
import { AccountForm } from 'components/shared/AccountForm';
import { LAST_7_DAYS_VALUE } from 'utils/constants';
import { mockApi } from 'utils/mockApi';
import type { TimeFrame } from 'types';

export const DashboardContent: React.FC = () => {
  const { name } = useSession().data?.user || {};
  const [selectedSource, setSelectedSource] = useState('');
  const [timeFrame, setTimeFrame] = useState<TimeFrame>(LAST_7_DAYS_VALUE);

  const {
    sourceOptions,
    totalRequests = 0,
    totalRequestsGrowth = 0,
    requestsData = [],
    routesData = [],
  } = mockApi({ source: selectedSource, timeFrame });

  if (!name) {
    return (
      <>
        <h2 className="text-2xl text-secondary animate-fade-in-top animation-delay-400">
          Finish up your account to continue
        </h2>
        <AccountForm />
      </>
    );
  }

  return (
    <>
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
    </>
  );
};
