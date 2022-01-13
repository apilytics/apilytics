import { ArrowsExpandIcon } from '@heroicons/react/solid';
import React from 'react';

import { DashboardCardContainer } from 'components/dashboard/DashboardCardContainer';
import { Button } from 'components/shared/Button';
import { Modal } from 'components/shared/Modal';
import { ModalCloseButton } from 'components/shared/ModalCloseButton';
import { useModal } from 'hooks/useModal';

interface Props {
  title: string;
  loading: boolean;
  noRequests?: boolean;
  renderBarChart: (expanded: boolean) => JSX.Element;
}

export const RouteMetricsContainer: React.FC<Props> = ({
  title,
  loading,
  noRequests,
  renderBarChart,
}) => {
  const { modalOpen, handleOpenModal, handleCloseModal } = useModal();

  const renderNoRequests = noRequests && (
    <div className="grow flex justify-center items-center">
      <p>No requests 🤷</p>
    </div>
  );

  const renderTitle = <p className="text-white font-bold px-2">{title}</p>;

  const renderModal = (
    <Modal open={modalOpen} onClose={handleCloseModal}>
      <div className="flex justify-between items-center p-2">
        {renderTitle}
        <ModalCloseButton onClick={handleCloseModal} />
      </div>
      <div className="overflow-y-auto p-4">
        <div className="grow flex">{renderBarChart(true)}</div>
      </div>
      <div className="p-6" />
    </Modal>
  );

  const renderRequests = (
    <>
      <div className="grow flex">{renderBarChart(false)}</div>
      <Button
        onClick={handleOpenModal}
        className="btn-sm btn-outline self-start"
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
      {renderModal}
    </DashboardCardContainer>
  );
};
