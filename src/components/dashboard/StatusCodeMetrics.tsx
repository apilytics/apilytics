import { ArrowsExpandIcon } from '@heroicons/react/solid';
import React from 'react';

import { BarValue } from 'components/dashboard/BarValue';
import { DashboardCard } from 'components/dashboard/DashboardCard';
import { StatusCodeTick } from 'components/dashboard/StatusCodeTick';
import { VerticalBarChart } from 'components/dashboard/VerticalBarChart';
import { Button } from 'components/shared/Button';
import { Modal } from 'components/shared/Modal';
import { ModalCloseButton } from 'components/shared/ModalCloseButton';
import { useModal } from 'hooks/useModal';
import { useOrigin } from 'hooks/useOrigin';
import { usePlausible } from 'hooks/usePlausible';
import { MODAL_NAMES } from 'utils/constants';
import { formatCount } from 'utils/metrics';
import type { StatusCodeData } from 'types';

interface Props {
  data: StatusCodeData[];
}

export const StatusCodeMetrics: React.FC<Props> = ({ data: _data }) => {
  const plausible = usePlausible();
  const { setSelectedStatusCode } = useOrigin();
  const { handleOpenModal, handleCloseModal } = useModal();
  const data = [..._data.sort((a, b) => b.count - a.count)];
  const truncatedData = data.slice(0, 10);

  const getHeight = (dataLength: number): number => 100 + dataLength * 35;
  const height = getHeight(data.length);
  const truncatedHeight = getHeight(truncatedData.length);

  const handleLabelClick = (data: StatusCodeData): void => {
    setSelectedStatusCode(String(data.statusCode));
    plausible('endpoint-click');
  };

  const handleShowAllClick = (): void => {
    handleOpenModal(MODAL_NAMES.statusCodes);
    plausible('show-all-status-codes-click');
  };

  const renderNoMetrics = !data.length && (
    <div className="flex flex-col justify-center items-center py-40">
      <p>No status codes available.</p>
    </div>
  );

  const renderLabels = (
    <BarValue formatter={(value?: string | number): string => formatCount(Number(value))} />
  );

  const renderMetrics = (
    <>
      <div className="grow flex">
        <VerticalBarChart
          height={truncatedHeight}
          data={truncatedData}
          dataKey="count"
          secondaryDataKey="statusCode"
          tick={<StatusCodeTick />}
          onLabelClick={handleLabelClick}
          renderLabels={renderLabels}
          label="Value"
          secondaryLabel="Count"
        />
      </div>
      <div className="flex">
        <Button
          onClick={handleShowAllClick}
          className="btn-sm btn-ghost"
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
      <div className="flex flex-wrap px-2 gap-4">
        <p className="text-white mr-auto">Status codes</p>
      </div>
      <div className="mt-4">{renderNoMetrics || renderMetrics}</div>
      <Modal name={MODAL_NAMES.statusCodes} mobileFullscreen>
        <div className="overflow-y-auto w-screen sm:w-auto sm:min-w-96">
          <div className="flex justify-between p-2">
            <p className="text-white pl-4">Status codes</p>
            <ModalCloseButton onClick={handleCloseModal} />
          </div>
          <div className="overflow-y-auto px-4">
            <div className="grow flex">
              <VerticalBarChart
                height={height}
                data={data}
                dataKey="count"
                secondaryDataKey="statusCode"
                tick={<StatusCodeTick />}
                onLabelClick={handleLabelClick}
                renderLabels={renderLabels}
                label="Value"
                secondaryLabel="Count"
              />
            </div>
          </div>
          <div className="p-6" />
        </div>
      </Modal>
    </DashboardCard>
  );
};
