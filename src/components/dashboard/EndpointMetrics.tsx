import { ArrowsExpandIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
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
  const { setSelectedMethod, setSelectedEndpoint } = useOrigin();
  const [metricType, setMetricType] = useState<ValueOf<typeof METRIC_TYPES>>(METRIC_TYPES.requests);
  const [activeTab, setActiveTab] = useState<ValueOf<typeof METRIC_TYPES>>(METRIC_TYPES.requests);
  const requestsData = [..._data.sort((a, b) => b.totalRequests - a.totalRequests)];
  const responseTimeData = [..._data.sort((a, b) => b.responseTimeAvg - a.responseTimeAvg)];
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
    data: modalData,
    valueKey: modalValueKey,
    label: modalLabel,
    renderValue: renderModalValue,
  } = attributes[activeTab];

  const truncatedData = data.slice(0, 10);

  const handleLabelClick = (data: Partial<EndpointData>): void => {
    setSelectedMethod(data.method);
    setSelectedEndpoint(data.endpoint);
    plausible('endpoint-click');
  };

  const handleShowAllClick = (): void => {
    handleOpenModal(MODAL_NAMES.endpoints);
    plausible('show-all-endpoints-click');
  };

  const renderLabel = ({ method, endpoint }: Partial<EndpointData>): JSX.Element => (
    <a className="unstyled text-white hover:text-primary">
      <span className={`text-method-${method?.toLowerCase()} cursor-pointer`}>{method}</span>{' '}
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
      <div className="flex">
        <Button
          onClick={handleShowAllClick}
          className="btn-ghost btn-sm"
          endIcon={ArrowsExpandIcon}
          fullWidth="mobile"
        >
          Show all ({formatCount(data.length)})
        </Button>
      </div>
    </>
  );

  return (
    <DashboardCard>
      <div className="flex flex-wrap gap-4 px-2">
        <p className="mr-auto text-white">Endpoints</p>
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
      <Modal name={MODAL_NAMES.endpoints} mobileFullscreen>
        <div className="w-screen overflow-y-auto sm:w-128 sm:min-w-96">
          <div className="flex justify-between p-2">
            <p className="pl-4 text-white">Endpoints</p>
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
                data={modalData}
                valueKey={modalValueKey}
                renderValue={renderModalValue}
                rightLabel={modalLabel}
              />
            </div>
          </div>
          <div className="p-6" />
        </div>
      </Modal>
    </DashboardCard>
  );
};
