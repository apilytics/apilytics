import { ArrowsExpandIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import React from 'react';
import { Bar, BarChart, Label, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import type { ContentType } from 'recharts/types/component/Label';

import { DashboardCardContainer } from 'components/dashboard/DashboardCardContainer';
import { MethodAndEndpointTick } from 'components/dashboard/MethodAndEndpointTick';
import { Button } from 'components/shared/Button';
import { Modal } from 'components/shared/Modal';
import { ModalCloseButton } from 'components/shared/ModalCloseButton';
import { useModal } from 'hooks/useModal';
import { MODAL_NAMES } from 'utils/constants';
import { truncateString } from 'utils/helpers';
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
  selectedEndpoint: EndpointData | null;
  setSelectedEndpoint: (data: EndpointData | null) => void;
}

export const EndpointMetrics: React.FC<Props> = ({
  title,
  label,
  modalName,
  loading,
  data,
  dataKey,
  renderLabels,
  selectedEndpoint,
  setSelectedEndpoint,
}) => {
  const { handleOpenModal, handleCloseModal } = useModal();

  const handleBarClick = (data: EndpointData): void => {
    setSelectedEndpoint(data);
    handleOpenModal(MODAL_NAMES.requestDetails);
  };

  const handleCloseEndpointDetails = (): void => {
    setSelectedEndpoint(null);
    handleCloseModal();
  };

  const renderBarChart = (expanded: boolean): JSX.Element => {
    const _data = data
      .slice(0, expanded ? data.length : 12)
      .map((d) => ({ ...d, methodAndEndpoint: `${d.method} ${d.endpoint}` }));

    const height = 100 + _data.length * 35;

    return (
      <ResponsiveContainer height={height}>
        <BarChart data={_data} layout="vertical" barSize={30}>
          <Bar
            dataKey={dataKey}
            fill="rgba(82, 157, 255, 0.25)" // `primary` with 25% opacity.
            onClick={handleBarClick}
          >
            <LabelList content={renderLabels} />
          </Bar>
          <XAxis
            dataKey={dataKey}
            type="number"
            orientation="top"
            axisLine={false}
            tick={false}
            mirror
            domain={[0, (dataMax: number): number => dataMax * 1.2]} // Prevent bars from overlapping labels.
          >
            <Label value={label} fill="var(--base-content)" position="insideTopRight" />
          </XAxis>
          <YAxis
            dataKey="methodAndEndpoint"
            type="category"
            tickLine={false}
            axisLine={false}
            mirror
            stroke="white"
            tick={<MethodAndEndpointTick />}
            padding={{ top: 30, bottom: 20 }}
            tickFormatter={(val: string): string => truncateString(val, 50)}
          >
            <Label value="Endpoints" fill="var(--base-content)" position="insideTopLeft" />
          </YAxis>
        </BarChart>
      </ResponsiveContainer>
    );
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
        <div className="grow flex">{renderBarChart(true)}</div>
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
        <Modal name={MODAL_NAMES.requestDetails}>
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
      <div className="grow flex">{renderBarChart(false)}</div>
      <Button
        onClick={(): void => handleOpenModal(modalName)}
        className="btn-sm btn-ghost self-start"
        endIcon={ArrowsExpandIcon}
      >
        Details
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
