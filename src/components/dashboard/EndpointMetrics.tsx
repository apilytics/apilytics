import { ArrowsExpandIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import React, { useState } from 'react';
import type { ContentType } from 'recharts/types/component/Label';

import { DashboardCardContainer } from 'components/dashboard/DashboardCardContainer';
import { EndpointBarChart } from 'components/dashboard/EndpointBarChart';
import { Button } from 'components/shared/Button';
import { Modal } from 'components/shared/Modal';
import { ModalCloseButton } from 'components/shared/ModalCloseButton';
import { useModal } from 'hooks/useModal';
import { MODAL_NAMES } from 'utils/constants';
import { formatRequests } from 'utils/metrics';
import { staticRoutes } from 'utils/router';
import type { EndpointData } from 'types';

interface Props {
  title: string;
  label: string;
  loading: boolean;
  modalName: string;
  data: EndpointData[];
  dataKey: string;
  renderLabels: ContentType;
}

export const EndpointMetrics: React.FC<Props> = ({
  title,
  label,
  modalName,
  loading,
  data: _data,
  dataKey,
  renderLabels,
}) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointData | null>(null);
  const { handleOpenModal, handleCloseModal } = useModal();

  const data = _data.map((d) => ({ ...d, methodAndEndpoint: `${d.method} ${d.endpoint}` }));
  const truncatedData = data.slice(0, 12);

  const getHeight = (dataLength: number): number => 100 + dataLength * 35;
  const height = getHeight(data.length);
  const truncatedHeight = getHeight(truncatedData.length);

  const handleBarClick = (data: EndpointData): void => {
    setSelectedEndpoint(data);
    handleOpenModal(MODAL_NAMES.requestDetails);
  };

  const handleCloseEndpointDetails = (): void => {
    setSelectedEndpoint(null);
    handleCloseModal();
  };

  const renderNoRequests = !data.length && (
    <div className="flex justify-center items-center py-20">
      <p>No requests 🤷</p>
    </div>
  );

  const renderTitle = <p className="text-white font-bold px-2">{title}</p>;

  const renderRequestsModal = (
    <Modal name={modalName} mobileFullscreen>
      <div className="flex justify-between items-center p-2">
        {renderTitle}
        <ModalCloseButton onClick={handleCloseModal} />
      </div>
      <div className="overflow-y-auto px-4">
        <div className="grow flex">
          <EndpointBarChart
            height={height}
            data={data}
            dataKey={dataKey}
            onBarClick={handleBarClick}
            renderLabels={renderLabels}
            label={label}
          />
        </div>
      </div>
      <div className="p-6" />
    </Modal>
  );

  const renderEndpointDetailsModal = (): JSX.Element | void => {
    if (selectedEndpoint) {
      const {
        endpoint,
        method,
        requests,
        avg_response_time,
        status_codes,
        p50,
        p75,
        p90,
        p95,
        p99,
      } = selectedEndpoint;

      return (
        <Modal name={MODAL_NAMES.requestDetails} onClose={handleCloseEndpointDetails}>
          <div className="flex justify-between items-center p-2">
            <p className="font-bold px-2">
              <span className={`text-method-${method.toLowerCase()}`}>{method}</span>{' '}
              <span className="text-white">{endpoint}</span>
            </p>
            <ModalCloseButton onClick={handleCloseEndpointDetails} />
          </div>
          <div className="p-4">
            <ul className="list-none">
              <li>
                Requests: <span className="font-bold text-white">{formatRequests(requests)}</span>
              </li>
              <li>
                Avg. response time:{' '}
                <span className="font-bold text-white">{avg_response_time}ms</span>
              </li>
              <li>
                Status codes:{' '}
                <span className="font-bold text-white">{status_codes.join(', ')}</span>
              </li>
              <p className="flex items-center">Thresholds:</p>
              <li>
                p50: <span className="font-bold text-white">{p50}ms</span>
              </li>
              <li>
                p75: <span className="font-bold text-white">{p75}ms</span>
              </li>
              <li>
                p90: <span className="font-bold text-white">{p90}ms</span>
              </li>
              <li>
                p95: <span className="font-bold text-white">{p95}ms</span>
              </li>
              <li>
                p99: <span className="font-bold text-white">{p99}ms</span>
              </li>
            </ul>
            <p className="text-sm mt-2">
              See our <Link href={`${staticRoutes.dashboard}#endpoint-response-times`}>docs</Link>{' '}
              for thresholds.
            </p>
          </div>
        </Modal>
      );
    }
  };

  const renderRequests = (
    <>
      <div className="grow flex">
        <EndpointBarChart
          height={truncatedHeight}
          data={truncatedData}
          dataKey={dataKey}
          onBarClick={handleBarClick}
          renderLabels={renderLabels}
          label={label}
        />
      </div>
      <Button
        onClick={(): void => handleOpenModal(modalName)}
        className="btn-sm btn-ghost self-start"
        endIcon={ArrowsExpandIcon}
      >
        Show all ({formatRequests(data.length)})
      </Button>
    </>
  );

  return (
    <DashboardCardContainer loading={loading} grow>
      {renderTitle}
      {renderNoRequests || renderRequests}
      {renderRequestsModal}
      {renderEndpointDetailsModal()}
    </DashboardCardContainer>
  );
};
