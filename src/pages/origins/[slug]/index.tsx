import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';

import { DashboardOptions } from 'components/Demo/DashboardOptions';
import { RequestsOverview } from 'components/Demo/RequestsOverview';
import { ResponseTimes } from 'components/Demo/ResponseTimes';
import { RouteMetrics } from 'components/Demo/RouteMetrics';
import { LoadingTemplate } from 'components/layout/LoadingTemplate';
import { MainTemplate } from 'components/layout/MainTemplate';
import { NotFoundTemplate } from 'components/layout/NotFoundTemplate';
import { withAuth } from 'hocs/withAuth';
import { withOrigin } from 'hocs/withOrigin';
import { useOrigin } from 'hooks/useOrigin';
import { LAST_7_DAYS_VALUE } from 'utils/constants';
import { dynamicApiRoutes } from 'utils/router';
import type { TimeFrame } from 'types';

const REQUEST_TIME_FORMAT = 'YYYY-MM-DD:HH:mm:ss';

const Origin: NextPage = () => {
  const { origin, metrics, setMetrics } = useOrigin();
  const [loading, setLoading] = useState(false);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>(LAST_7_DAYS_VALUE);
  const slug = origin?.slug || '';

  useEffect(() => {
    (async (): Promise<void> => {
      setLoading(true);
      const from = dayjs().subtract(timeFrame, 'day').format(REQUEST_TIME_FORMAT);
      const to = dayjs().format(REQUEST_TIME_FORMAT);
      const res = await fetch(dynamicApiRoutes.originMetrics({ slug, from, to }));
      const { data } = await res.json();
      setMetrics(data);
      setLoading(false);
    })();
  }, [setMetrics, slug, timeFrame]);

  if (loading && (!origin || !metrics)) {
    return <LoadingTemplate />;
  }

  if (!origin || !metrics) {
    return <NotFoundTemplate />;
  }

  return (
    <MainTemplate maxWidth="5xl">
      <DashboardOptions timeFrame={timeFrame} setTimeFrame={setTimeFrame} origin={origin} />
      <RequestsOverview timeFrame={timeFrame} origin={origin} metrics={metrics} loading={loading} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 grow">
        <RouteMetrics metrics={metrics} loading={loading} />
        <ResponseTimes metrics={metrics} loading={loading} />
      </div>
    </MainTemplate>
  );
};

export default withOrigin(withAuth(Origin));
