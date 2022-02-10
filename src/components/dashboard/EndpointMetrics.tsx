import { ArrowsExpandIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import React, { useState } from 'react';

import { BarValue } from 'components/dashboard/BarValue';
import { DashboardCard } from 'components/dashboard/DashboardCard';
import { MethodAndEndpointTick } from 'components/dashboard/MethodAndEndpointTick';
import { VerticalBarChart } from 'components/dashboard/VerticalBarChart';
import { Button } from 'components/shared/Button';
import { Modal } from 'components/shared/Modal';
import { ModalCloseButton } from 'components/shared/ModalCloseButton';
import { useModal } from 'hooks/useModal';
import { useOrigin } from 'hooks/useOrigin';
import { usePlausible } from 'hooks/usePlausible';
import { MODAL_NAMES } from 'utils/constants';
import { formatCount } from 'utils/metrics';
import type { EndpointData, ValueOf } from 'types';

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
  const { handleOpenModal, handleCloseModal } = useModal();

  const attributes = {
    requests: {
      data: requestsData,
      formatter: (value?: string | number): string => formatCount(Number(value)),
      dataKey: 'totalRequests',
      label: 'Requests',
      emptyLabel: 'No requests available.',
    },
    responseTimes: {
      data: responseTimeData,
      formatter: (value?: string | number): string => `${value}ms`,
      dataKey: 'responseTimeAvg',
      label: 'Response times',
      emptyLabel: 'No response times available.',
    },
  };

  const { data, dataKey, label, emptyLabel, formatter } = attributes[metricType];

  const {
    data: modalData,
    dataKey: modalDataKey,
    label: modalLabel,
    formatter: modalFormatter,
  } = attributes[activeTab];

  const truncatedData = data.slice(0, 10);
  const getHeight = (dataLength: number): number => 100 + dataLength * 35;
  const height = getHeight(data.length);
  const truncatedHeight = getHeight(truncatedData.length);

  const handleLabelClick = (data: EndpointData): void => {
    setSelectedMethod(data.method);
    setSelectedEndpoint(data.endpoint);
    plausible('endpoint-click');
  };

  const handleShowAllClick = (): void => {
    handleOpenModal(MODAL_NAMES.endpoints);
    plausible('show-all-endpoints-click');
  };

  const renderNoMetrics = !data.length && (
    <div className="flex flex-col items-center justify-center py-40">
      <p>{emptyLabel}</p>
    </div>
  );

  const renderMetrics = (
    <>
      <div className="flex grow">
        <VerticalBarChart
          height={truncatedHeight}
          data={truncatedData}
          dataKey={dataKey}
          secondaryDataKey="methodAndEndpoint"
          tick={<MethodAndEndpointTick />}
          onLabelClick={handleLabelClick}
          renderLabels={<BarValue formatter={formatter} />}
          label="Name"
          secondaryLabel={label}
        />
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
          <p
            className={clsx(
              'tab tab-bordered',
              metricType === METRIC_TYPES.requests && 'tab-active',
            )}
            onClick={(): void => setMetricType(METRIC_TYPES.requests)}
          >
            Requests
          </p>
          <p
            className={clsx(
              'tab tab-bordered',
              metricType === METRIC_TYPES.responseTimes && 'tab-active',
            )}
            onClick={(): void => setMetricType(METRIC_TYPES.responseTimes)}
          >
            Response times
          </p>
        </div>
      </div>
      <div className="mt-4">{renderNoMetrics || renderMetrics}</div>
      <Modal name={MODAL_NAMES.endpoints} mobileFullscreen>
        <div className="w-screen overflow-y-auto sm:w-auto sm:min-w-96">
          <div className="flex justify-between p-2">
            <p className="pl-4 text-white">Endpoints</p>
            <ModalCloseButton onClick={handleCloseModal} />
          </div>
          <div className="tabs my-2 px-6">
            <p
              className={clsx(
                'tab tab-bordered grow',
                activeTab === METRIC_TYPES.requests && 'tab-active',
              )}
              onClick={(): void => setActiveTab(METRIC_TYPES.requests)}
            >
              Requests
            </p>
            <p
              className={clsx(
                'tab tab-bordered grow',
                activeTab === METRIC_TYPES.responseTimes && 'tab-active',
              )}
              onClick={(): void => setActiveTab(METRIC_TYPES.responseTimes)}
            >
              Response times
            </p>
          </div>
          <div className="overflow-y-auto px-4">
            <div className="flex grow">
              <VerticalBarChart
                height={height}
                data={modalData}
                dataKey={modalDataKey}
                secondaryDataKey="methodAndEndpoint"
                tick={<MethodAndEndpointTick />}
                onLabelClick={handleLabelClick}
                renderLabels={<BarValue formatter={modalFormatter} />}
                label="Name"
                secondaryLabel={modalLabel}
              />
            </div>
          </div>
          <div className="p-6" />
        </div>
      </Modal>
    </DashboardCard>
  );
};
