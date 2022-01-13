import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';

import { DashboardOptions } from 'components/dashboard/DashboardOptions';
import { RequestsOverview } from 'components/dashboard/RequestsOverview';
import { ResponseTimes } from 'components/dashboard/ResponseTimes';
import { RouteMetrics } from 'components/dashboard/RouteMetrics';
import { LoadingTemplate } from 'components/layout/LoadingTemplate';
import { MainTemplate } from 'components/layout/MainTemplate';
import { NotFoundTemplate } from 'components/layout/NotFoundTemplate';
import { ApiKeyField } from 'components/shared/ApiKeyField';
import { Modal } from 'components/shared/Modal';
import { ModalCloseButton } from 'components/shared/ModalCloseButton';
import { withAuth } from 'hocs/withAuth';
import { withOrigin } from 'hocs/withOrigin';
import { useModal } from 'hooks/useModal';
import { useOrigin } from 'hooks/useOrigin';
import { WEEK_DAYS } from 'utils/constants';
import { dynamicApiRoutes, dynamicRoutes, staticRoutes } from 'utils/router';
import type { TimeFrame } from 'types';

export const REQUEST_TIME_FORMAT = 'YYYY-MM-DD:HH:mm:ss';

const Origin: NextPage = () => {
  const router = useRouter();
  const { showApiKey } = router.query;
  const { origin, metrics, setMetrics } = useOrigin();
  const [loading, setLoading] = useState(false);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>(WEEK_DAYS);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const { modalOpen, handleOpenModal, handleCloseModal } = useModal();
  const slug = origin?.slug || '';
  const apiKey = origin?.apiKey || '';

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

  useEffect(() => {
    if (showApiKey) {
      console.log('open modal');
      handleOpenModal();
      router.replace(dynamicRoutes.origin({ slug }));
    }
  }, [handleOpenModal, router, showApiKey, slug]);

  if (loading && (!origin || !metrics)) {
    return <LoadingTemplate />;
  }

  if (!origin || !metrics) {
    return <NotFoundTemplate />;
  }

  return (
    <MainTemplate wide>
      <DashboardOptions timeFrame={timeFrame} setTimeFrame={setTimeFrame} origin={origin} />
      <RequestsOverview timeFrame={timeFrame} origin={origin} metrics={metrics} loading={loading} />
      <div className="grow flex flex-col lg:flex-row gap-4 mt-4">
        <RouteMetrics metrics={metrics} loading={loading} />
        <ResponseTimes metrics={metrics} loading={loading} />
      </div>
      <p className="mt-4 text-center">
        Help us improve the service by <Link href={staticRoutes.contact}>giving us feedback</Link>.
      </p>
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <div className="flex justify-between items-center p-2">
          <h6 className="px-2 text-white">Almost ready!</h6>
          <ModalCloseButton onClick={handleCloseModal} />
        </div>
        <div className="px-4">
          <p>Finish configuration by setting up your API key.</p>
        </div>
        <div className="p-4">
          <ApiKeyField value={apiKey} apiKeyCopiedCallback={(): void => setApiKeyCopied(true)} />
          {apiKeyCopied && (
            <span className="label-text-alt text-white">API key copied to the clipboard.</span>
          )}
        </div>
      </Modal>
    </MainTemplate>
  );
};

export default withOrigin(withAuth(Origin));
