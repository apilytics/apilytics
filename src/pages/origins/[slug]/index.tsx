import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';

import { DashboardOptions } from 'components/dashboard/DashboardOptions';
import { EndpointMetrics } from 'components/dashboard/EndpointMetrics';
import { TimeFrameMetrics } from 'components/dashboard/TimeFrameMetrics';
import { ErrorTemplate } from 'components/layout/ErrorTemplate';
import { Layout } from 'components/layout/Layout';
import { LoadingTemplate } from 'components/layout/LoadingTemplate';
import { NotFoundTemplate } from 'components/layout/NotFoundTemplate';
import { ApiKeyField } from 'components/shared/ApiKeyField';
import { Modal } from 'components/shared/Modal';
import { ModalCloseButton } from 'components/shared/ModalCloseButton';
import { withAuth } from 'hocs/withAuth';
import { withOrigin } from 'hocs/withOrigin';
import { useModal } from 'hooks/useModal';
import { useOrigin } from 'hooks/useOrigin';
import { MODAL_NAMES } from 'utils/constants';
import { dynamicApiRoutes, dynamicRoutes, staticRoutes } from 'utils/router';

const REQUEST_TIME_FORMAT = 'YYYY-MM-DD:HH:mm:ss';

const Origin: NextPage = () => {
  const router = useRouter();
  const { showApiKey } = router.query;
  const { origin, metrics, setMetrics, timeFrame, selectedEndpoint } = useOrigin();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { handleOpenModal, handleCloseModal } = useModal();
  const slug = origin?.slug || '';
  const apiKey = origin?.apiKey || '';
  const maxWidth = 'max-w-6xl';

  useEffect(() => {
    (async (): Promise<void> => {
      const from = dayjs().subtract(timeFrame, 'day').format(REQUEST_TIME_FORMAT);
      const to = dayjs().format(REQUEST_TIME_FORMAT);
      const { method = '', endpoint = '' } = selectedEndpoint || {};

      try {
        const res = await fetch(
          dynamicApiRoutes.originMetrics({ slug, from, to, method, endpoint }),
        );

        const { data } = await res.json();

        if (res.status === 200) {
          setMetrics(data);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [setMetrics, slug, timeFrame, selectedEndpoint]);

  useEffect(() => {
    if (showApiKey) {
      handleOpenModal(MODAL_NAMES.apiKey);
      router.replace(dynamicRoutes.origin({ slug }), undefined, { shallow: true });
    }
  }, [handleOpenModal, router, showApiKey, slug]);

  if (loading) {
    return <LoadingTemplate />;
  }

  if (!origin || !metrics) {
    return <NotFoundTemplate />;
  }

  if (error) {
    return <ErrorTemplate />;
  }

  const { totalRequests, totalErrors, timeFrameData, endpointData } = metrics;

  return (
    <Layout
      headProps={{ title: origin.name }}
      headerProps={{ maxWidth }}
      footerProps={{ maxWidth }}
    >
      <div className="container py-4 max-w-6xl grow flex flex-col">
        <DashboardOptions origin={origin} />
        <TimeFrameMetrics
          totalRequests={totalRequests}
          totalErrors={totalErrors}
          data={timeFrameData}
        />
        <div className="mt-4">
          <EndpointMetrics data={endpointData} />
        </div>
        <p className="mt-4">
          See our <Link href={staticRoutes.dashboard}>docs</Link> for more details about these
          metrics. Help us improve this dashboard by{' '}
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
      </div>
    </Layout>
  );
};

export default withOrigin(withAuth(Origin));
