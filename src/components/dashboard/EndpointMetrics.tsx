import { ArrowsExpandIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import React, { useState } from 'react';
import type { ContentType } from 'recharts/types/component/Label';

import { DashboardCard } from 'components/dashboard/DashboardCard';
import { EndpointBarChart } from 'components/dashboard/EndpointBarChart';
import { EndpointMetricStats } from 'components/dashboard/EndpointMetricStats';
import { Button } from 'components/shared/Button';
import { Modal } from 'components/shared/Modal';
import { ModalCloseButton } from 'components/shared/ModalCloseButton';
import { useModal } from 'hooks/useModal';
import { useOrigin } from 'hooks/useOrigin';
import { usePlausible } from 'hooks/usePlausible';
import { MODAL_NAMES, UNKNOWN_STATUS_CODE } from 'utils/constants';
import { formatCount } from 'utils/metrics';
import { dynamicRoutes, staticRoutes } from 'utils/router';
import type { EndpointData } from 'types';

interface Props {
  label: string;
  expandButtonLabel: string;
  modalName: string;
  data: EndpointData[];
  dataKey: string;
  renderLabels: ContentType;
}

export const EndpointMetrics: React.FC<Props> = ({
  label,
  expandButtonLabel,
  modalName,
  data: _data,
  dataKey,
  renderLabels,
}) => {
  const plausible = usePlausible();
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointData | null>(null);
  const { handleOpenModal, handleCloseModal } = useModal();
  const { origin } = useOrigin();
  const slug = origin?.slug || '';

  const data = _data.map((d) => ({ ...d, methodAndEndpoint: `${d.method} ${d.endpoint}` }));
  const truncatedData = data.slice(0, 10);

  const getHeight = (dataLength: number): number => 100 + dataLength * 35;
  const height = getHeight(data.length);
  const truncatedHeight = getHeight(truncatedData.length);

  const handleLabelClick = (data: EndpointData): void => {
    setSelectedEndpoint(data);
    handleOpenModal(MODAL_NAMES.requestDetails);
    plausible('endpoint-click');
  };

  const handleCloseEndpointDetails = (): void => {
    setSelectedEndpoint(null);
    handleCloseModal();
  };

  const handleShowAllClick = (): void => {
    handleOpenModal(modalName);

    if (dataKey === 'requests') {
      plausible('show-all-requests-click');
    } else {
      plausible('show-all-response-times-click');
    }
  };

  const renderNoMetrics = !data.length && (
    <div className="flex justify-center items-center py-20">
      <p>No metrics 🤷</p>
    </div>
  );

  const renderMetricsModal = (
    <Modal name={modalName} mobileFullscreen>
      <div className="overflow-y-auto w-screen sm:w-auto sm:min-w-96">
        <div className="flex justify-end p-2">
          <ModalCloseButton onClick={handleCloseModal} />
        </div>
        <div className="overflow-y-auto px-4">
          <div className="grow flex">
            <EndpointBarChart
              height={height}
              data={data}
              dataKey={dataKey}
              onLabelClick={handleLabelClick}
              renderLabels={renderLabels}
              label={label}
            />
          </div>
        </div>
        <div className="p-6" />
      </div>
    </Modal>
  );

  const renderEndpointDetailsModal = (): JSX.Element | void => {
    if (selectedEndpoint) {
      const {
        endpoint,
        method,
        totalRequests,
        statusCodes,
        responseTimes,
        requestSizes,
        responseSizes,
      } = selectedEndpoint;

      return (
        <Modal
          name={MODAL_NAMES.requestDetails}
          onClose={handleCloseEndpointDetails}
          mobileFullscreen
        >
          <div className="overflow-y-auto w-screen sm:w-auto sm:min-w-96">
            <div className="flex justify-between items-center p-2">
              <h5 className="px-2 text-white">Endpoint details</h5>
              <ModalCloseButton onClick={handleCloseEndpointDetails} />
            </div>
            <div className="p-4 pt-0">
              <p>
                Endpoint: <span className={`text-method-${method.toLowerCase()}`}>{method}</span>{' '}
                <span className="text-white">{endpoint}</span>
              </p>
              <p>
                Total requests:{' '}
                <span className="font-bold text-white">{formatCount(totalRequests)}</span>
              </p>
              <p>
                Status codes:{' '}
                <span className="font-bold text-white">
                  {statusCodes
                    .map((code) => (code === UNKNOWN_STATUS_CODE ? 'unknown' : code))
                    .join(', ')}
                </span>
              </p>
              <EndpointMetricStats title="Response times" unit="ms" {...responseTimes} />
              <EndpointMetricStats title="Request sizes" unit="kB" {...requestSizes} />
              <EndpointMetricStats title="Response sizes" unit="kB" {...responseSizes} />
              <p className="text-sm mt-4">
                Combine this endpoint with your other endpoints with our{' '}
                <Link href={dynamicRoutes.originDynamicRoutes({ slug })}>dynamic routes</Link>.
              </p>
            </div>
          </div>
        </Modal>
      );
    }
  };

  const renderMetrics = (
    <>
      <div className="grow flex">
        <EndpointBarChart
          height={truncatedHeight}
          data={truncatedData}
          dataKey={dataKey}
          onLabelClick={handleLabelClick}
          renderLabels={renderLabels}
          label={label}
        />
      </div>
      <div className="flex">
        <Button
          onClick={handleShowAllClick}
          className="btn-sm btn-ghost"
          endIcon={ArrowsExpandIcon}
          fullWidth="mobile"
        >
          {expandButtonLabel} ({formatCount(data.length)})
        </Button>
      </div>
    </>
  );

  return (
    <DashboardCard>
      {renderNoMetrics || renderMetrics}
      {renderMetricsModal}
      {renderEndpointDetailsModal()}
    </DashboardCard>
  );
};
