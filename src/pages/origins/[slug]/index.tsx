import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';

import { DashboardOptions } from 'components/dashboard/DashboardOptions';
import { EndpointRequests } from 'components/dashboard/EndpointRequests';
import { EndpointResponseTimes } from 'components/dashboard/EndpointResponseTimes';
import { RequestsTimeFrame } from 'components/dashboard/RequestsTimeFrame';
import { LoadingTemplate } from 'components/layout/LoadingTemplate';
import { MainTemplate } from 'components/layout/MainTemplate';
import { ApiKeyField } from 'components/shared/ApiKeyField';
import { Modal } from 'components/shared/Modal';
import { ModalCloseButton } from 'components/shared/ModalCloseButton';
import { withAuth } from 'hocs/withAuth';
import { withOrigin } from 'hocs/withOrigin';
import { useModal } from 'hooks/useModal';
import { useOrigin } from 'hooks/useOrigin';
import { MODAL_NAMES, WEEK_DAYS } from 'utils/constants';
import { dynamicApiRoutes, dynamicRoutes, staticRoutes } from 'utils/router';
import type { EndpointData, TimeFrame } from 'types';

const REQUEST_TIME_FORMAT = 'YYYY-MM-DD:HH:mm:ss';

const Origin: NextPage = () => {
  const router = useRouter();
  const { showApiKey } = router.query;
  const { origin, metrics, setMetrics } = useOrigin();
  const [loading, setLoading] = useState(true);
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointData | null>(null);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>(WEEK_DAYS);
  const { handleOpenModal, handleCloseModal } = useModal();
  const slug = origin?.slug || '';
  const apiKey = origin?.apiKey || '';

  useEffect(() => {
    (async (): Promise<void> => {
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
      handleOpenModal(MODAL_NAMES.apiKey);
      router.replace(dynamicRoutes.origin({ slug }), undefined, { shallow: true });
    }
  }, [handleOpenModal, router, showApiKey, slug]);

  if (loading || !origin || !metrics) {
    return <LoadingTemplate />;
  }

  return (
    <MainTemplate maxWidth="max-w-6xl" dense title={origin.name}>
      <DashboardOptions timeFrame={timeFrame} setTimeFrame={setTimeFrame} origin={origin} />
      <RequestsTimeFrame
        timeFrame={timeFrame}
        origin={origin}
        metrics={metrics}
        loading={loading}
      />
      <div className="grow flex flex-col lg:flex-row gap-4 mt-4">
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
      <p className="mt-4 text-center">
        Help us improve this dashboard by{' '}
        <Link href={staticRoutes.contact}>
          <a>giving us feedback</a>
        </Link>
        .
      </p>
      <Modal name={MODAL_NAMES.apiKey}>
        <div className="flex justify-between items-center p-2">
          <h6 className="px-2 text-white">Almost ready!</h6>
          <ModalCloseButton onClick={handleCloseModal} />
        </div>
        <div className="px-4">
          <p>Finish configuration by setting up your API key.</p>
        </div>
        <div className="p-4">
          <ApiKeyField value={apiKey} />
        </div>
      </Modal>
    </MainTemplate>
  );
};

export default withOrigin(withAuth(Origin));
