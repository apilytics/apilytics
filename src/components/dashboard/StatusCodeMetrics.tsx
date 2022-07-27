import { ArrowsExpandIcon } from '@heroicons/react/solid';
import React from 'react';

import { DashboardCard } from 'components/dashboard/DashboardCard';
import { VerticalBarChart } from 'components/dashboard/VerticalBarChart';
import { Button } from 'components/shared/Button';
import { Modal } from 'components/shared/Modal';
import { ModalCloseButton } from 'components/shared/ModalCloseButton';
import { useContext } from 'hooks/useContext';
import { usePlausible } from 'hooks/usePlausible';
import { MODAL_NAMES } from 'utils/constants';
import { formatCount } from 'utils/metrics';
import type { StatusCodeData } from 'types';

interface Props {
  data: StatusCodeData[];
}

export const StatusCodeMetrics: React.FC<Props> = ({ data: _data }) => {
  const plausible = usePlausible();
  const { setSelectedStatusCode, handleOpenModal, handleCloseModal } = useContext();
  const data = [..._data.sort((a, b) => b.requests - a.requests)];
  const truncatedData = data.slice(0, 10);

  const handleBarClick = ({ statusCode }: Partial<StatusCodeData>): void => {
    if (statusCode) {
      setSelectedStatusCode(String(statusCode));
    }

    plausible('status-code-click');
  };

  const handleShowAllClick = (): void => {
    handleOpenModal(MODAL_NAMES.STATUS_CODES);
    plausible('show-all-status-codes-click');
  };

  const renderLabel = ({ statusCode }: Partial<StatusCodeData>): JSX.Element => (
    <a className="unstyled text-white hover:text-primary">
      <span className="link">{statusCode}</span>
    </a>
  );

  const barChartProps = {
    data: truncatedData,
    valueKey: 'requests',
    renderLabel: renderLabel,
    renderValue: ({ requests }: Partial<StatusCodeData>): string => formatCount(requests),
    onBarClick: handleBarClick,
    leftLabel: 'Value',
    rightLabel: 'Requests',
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
        >
          Show all ({formatCount(data.length)})
        </Button>
      </div>
    </>
  );

  return (
    <DashboardCard>
      <div className="flex flex-wrap gap-4 px-2">
        <p className="mr-auto text-white">Status codes (top {truncatedData.length})</p>
      </div>
      <div className="mt-4 flex grow flex-col">{renderMetrics}</div>
      <Modal name={MODAL_NAMES.STATUS_CODES} mobileFullscreen>
        <div className="w-screen overflow-y-auto sm:w-auto sm:min-w-96">
          <div className="flex justify-between p-2">
            <p className="pl-4 text-white">Status codes (top {data.length})</p>
            <ModalCloseButton onClick={handleCloseModal} />
          </div>
          <div className="overflow-y-auto px-4">
            <div className="flex grow">
              <VerticalBarChart {...barChartProps} data={data} />
            </div>
          </div>
          <div className="p-6" />
        </div>
      </Modal>
    </DashboardCard>
  );
};
