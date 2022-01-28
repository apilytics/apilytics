import { ArrowsExpandIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import React, { useState } from 'react';
import type { ContentType } from 'recharts/types/component/Label';

import { DashboardCard } from 'components/dashboard/DashboardCard';
import { EndpointBarChart } from 'components/dashboard/EndpointBarChart';
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
        requests,
        status_codes,
        avg_response_time,
        response_time_p50,
        response_time_p75,
        response_time_p90,
        response_time_p95,
        response_time_p99,
        avg_request_size,
        request_size_p50,
        request_size_p75,
        request_size_p90,
        request_size_p95,
        request_size_p99,
        avg_response_size,
        response_size_p50,
        response_size_p75,
        response_size_p90,
        response_size_p95,
        response_size_p99,
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
                <span className="font-bold text-white">{formatCount(requests)}</span>
              </p>
              <p>
                Status codes:{' '}
                <span className="font-bold text-white">
                  {status_codes
                    .map((code) => (code === UNKNOWN_STATUS_CODE ? 'unknown' : code))
                    .join(', ')}
                </span>
              </p>
              <h6 className="text-white mt-4">Response times:</h6>
              <p>
                Average: <span className="font-bold text-white">{avg_response_time}ms</span>
              </p>
              <ul className="list-none">
                <li>
                  p50: <span className="font-bold text-white">{response_time_p50}ms</span>
                </li>
                <li>
                  p75: <span className="font-bold text-white">{response_time_p75}ms</span>
                </li>
                <li>
                  p90: <span className="font-bold text-white">{response_time_p90}ms</span>
                </li>
                <li>
                  p95: <span className="font-bold text-white">{response_time_p95}ms</span>
                </li>
                <li>
                  p99: <span className="font-bold text-white">{response_time_p99}ms</span>
                </li>
              </ul>
              <h6 className="text-white mt-4">Request sizes:</h6>
              <p>
                Average: <span className="font-bold text-white">{avg_request_size}kB</span>
              </p>
              <ul className="list-none">
                <li>
                  p50: <span className="font-bold text-white">{request_size_p50}kB</span>
                </li>
                <li>
                  p75: <span className="font-bold text-white">{request_size_p75}kB</span>
                </li>
                <li>
                  p90: <span className="font-bold text-white">{request_size_p90}kB</span>
                </li>
                <li>
                  p95: <span className="font-bold text-white">{request_size_p95}kB</span>
                </li>
                <li>
                  p99: <span className="font-bold text-white">{request_size_p99}kB</span>
                </li>
              </ul>
              <h6 className="text-white mt-4">Response sizes:</h6>
              <p>
                Average: <span className="font-bold text-white">{avg_response_size}kB</span>
              </p>
              <ul className="list-none">
                <li>
                  p50: <span className="font-bold text-white">{response_size_p50}kB</span>
                </li>
                <li>
                  p75: <span className="font-bold text-white">{response_size_p75}kB</span>
                </li>
                <li>
                  p90: <span className="font-bold text-white">{response_size_p90}kB</span>
                </li>
                <li>
                  p95: <span className="font-bold text-white">{response_size_p95}kB</span>
                </li>
                <li>
                  p99: <span className="font-bold text-white">{response_size_p99}kB</span>
                </li>
              </ul>
              <p className="text-sm mt-4">
                Learn what the p-values mean from our docs for{' '}
                <Link href={`${staticRoutes.dashboard}#endpoint-response-times`}>thresholds</Link>.
                <br />
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
