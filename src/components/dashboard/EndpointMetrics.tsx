import { ArrowsExpandIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { DashboardCard } from 'components/dashboard/DashboardCard';
import { VerticalBarChart } from 'components/dashboard/VerticalBarChart';
import { Button } from 'components/shared/Button';
import { Modal } from 'components/shared/Modal';
import { ModalCloseButton } from 'components/shared/ModalCloseButton';
import { useOrigin } from 'hooks/useOrigin';
import { usePlausible } from 'hooks/usePlausible';
import { useUIState } from 'hooks/useUIState';
import { MODAL_NAMES } from 'utils/constants';
import { formatCount, formatMilliseconds } from 'utils/metrics';
import { dynamicRoutes, staticRoutes } from 'utils/router';
import type { EndpointData, ValueOf, VerticalBarData } from 'types';

const METRIC_TYPES = {
  requests: 'requests',
  responseTimes: 'responseTimes',
} as const;

interface Props {
  data: EndpointData[];
}

export const EndpointMetrics: React.FC<Props> = ({ data: _data }) => {
  const plausible = usePlausible();
  const { slug, origin, setSelectedMethod, setSelectedEndpoint } = useOrigin();
  const [metricType, setMetricType] = useState<ValueOf<typeof METRIC_TYPES>>(METRIC_TYPES.requests);
  const [activeTab, setActiveTab] = useState<ValueOf<typeof METRIC_TYPES>>(METRIC_TYPES.requests);
  const requestsData = [..._data.sort((a, b) => b.totalRequests - a.totalRequests)];
  const responseTimeData = [..._data.sort((a, b) => b.responseTimeAvg - a.responseTimeAvg)];
  const { pathname } = useRouter();
  const isDemo = pathname === staticRoutes.demo;
  const { handleOpenModal, handleCloseModal } = useUIState();

  const attributes = {
    requests: {
      data: requestsData,
      renderValue: ({ totalRequests }: Partial<VerticalBarData>): string =>
        formatCount(totalRequests),
      valueKey: 'totalRequests',
      label: 'Requests',
    },
    responseTimes: {
      data: responseTimeData,
      renderValue: ({ responseTimeAvg }: Partial<VerticalBarData>): string =>
        formatMilliseconds(responseTimeAvg),
      valueKey: 'responseTimeAvg',
      label: 'Response times',
    },
  } as const;

  const { data, valueKey, label, renderValue } = attributes[metricType];

  const {
    data: _modalData,
    valueKey: modalValueKey,
    label: modalLabel,
    renderValue: renderModalValue,
  } = attributes[activeTab];

  const truncatedData = data.slice(0, 10);
  const pageSize = 10;
  const pages = Math.ceil(_modalData.length / pageSize);
  const [page, setPage] = useState(0);
  const offset = page * pageSize;
  const paginatedModalData = _modalData.slice(offset, offset + pageSize);

  const handleLabelClick = (data: Partial<EndpointData>): void => {
    setSelectedMethod(data.method);
    setSelectedEndpoint(data.endpoint);
    plausible('endpoint-click');
  };

  const handleShowAllClick = (): void => {
    handleOpenModal(MODAL_NAMES.ENDPOINTS);
    plausible('show-all-endpoints-click');
  };

  const renderLabel = ({ method, endpoint }: Partial<EndpointData>): JSX.Element => (
    <a className="unstyled text-white hover:text-primary">
      <span className={`text-method-${method?.toLowerCase()}`}>{method}</span>{' '}
      <span className="link">{endpoint}</span>
    </a>
  );

  const barChartProps = {
    data: truncatedData,
    valueKey: valueKey,
    renderLabel: renderLabel,
    renderValue: renderValue,
    onBarClick: handleLabelClick,
    leftLabel: 'Name',
    rightLabel: label,
  } as const;

  const renderMetrics = (
    <>
      <div className="flex grow">
        <VerticalBarChart {...barChartProps} />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button
          onClick={handleShowAllClick}
          className="btn-ghost btn-sm"
          endIcon={ArrowsExpandIcon}
        >
          Show all ({formatCount(data.length)})
        </Button>
        {!isDemo && (
          <Link href={dynamicRoutes.originDynamicRoutes({ slug })}>
            <a>Dynamic routes ({origin?.dynamicRouteCount})</a>
          </Link>
        )}
        {!isDemo && (
          <Link href={dynamicRoutes.originExcludedRoutes({ slug })}>
            <a>Excluded routes ({origin?.excludedRouteCount})</a>
          </Link>
        )}
      </div>
    </>
  );

  return (
    <DashboardCard>
      <div className="flex flex-wrap gap-4 px-2">
        <p className="mr-auto text-white">{attributes[metricType].label}</p>
        <div className="tabs">
          {Object.values(METRIC_TYPES).map((type) => (
            <p
              className={clsx(
                'tab tab-bordered',
                metricType === METRIC_TYPES[type] && 'tab-active',
              )}
              onClick={(): void => setMetricType(METRIC_TYPES[type])}
              key={type}
            >
              {attributes[type].label}
            </p>
          ))}
        </div>
      </div>
      <div className="mt-4">{renderMetrics}</div>
      <Modal name={MODAL_NAMES.ENDPOINTS} mobileFullscreen>
        <div className="w-screen overflow-y-auto sm:w-128 sm:min-w-96">
          <div className="flex justify-between p-2">
            <p className="pl-4 text-white">{attributes[activeTab].label}</p>
            <ModalCloseButton onClick={handleCloseModal} />
          </div>
          <div className="tabs my-2 px-6">
            {Object.values(METRIC_TYPES).map((type) => (
              <p
                className={clsx(
                  'tab tab-bordered grow',
                  activeTab === METRIC_TYPES[type] && 'tab-active',
                )}
                onClick={(): void => setActiveTab(METRIC_TYPES[type])}
                key={type}
              >
                {attributes[type].label}
              </p>
            ))}
          </div>
          <div className="overflow-y-auto px-4">
            <div className="flex grow">
              <VerticalBarChart
                {...barChartProps}
                data={paginatedModalData}
                valueKey={modalValueKey}
                renderValue={renderModalValue}
                rightLabel={modalLabel}
              />
            </div>
          </div>
          <div className="flex justify-center p-4">
            <div className="btn-group">
              {page > 0 && (
                <button className="btn" onClick={(): void => setPage(0)}>
                  {1}
                </button>
              )}
              {page > 2 && <button className="btn-disabled btn">...</button>}
              {page > 1 && (
                <button className="btn" onClick={(): void => setPage(page - 1)}>
                  {page}
                </button>
              )}
              <button className="btn btn-active">{page + 1}</button>
              {page < pages - 2 && (
                <button className="btn" onClick={(): void => setPage(page + 1)}>
                  {page + 2}
                </button>
              )}
              {page < pages - 3 && <button className="btn-disabled btn">...</button>}
              {page < pages - 1 && (
                <button className="btn" onClick={(): void => setPage(pages - 1)}>
                  {pages}
                </button>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </DashboardCard>
  );
};
