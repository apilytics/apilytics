import clsx from 'clsx';
import React from 'react';

import { Button } from 'components/shared/Button';
import { Modal } from 'components/shared/Modal';
import { ModalCloseButton } from 'components/shared/ModalCloseButton';
import { useUIState } from 'hooks/useUIState';
import type { MODAL_NAMES } from 'utils/constants';

interface Props {
  title: string;
  name: MODAL_NAMES;
  onConfirm: () => void;
  loading: boolean;
  dangerAction?: boolean;
}

export const ConfirmModal: React.FC<Props> = ({
  title,
  name,
  onConfirm,
  loading,
  dangerAction,
  children,
}) => {
  const { handleCloseModal } = useUIState();

  return (
    <Modal name={name}>
      <div className="flex items-center justify-between p-2">
        <p className="px-2 font-bold">
          <p className="text-white">{title}</p>
        </p>
        <ModalCloseButton onClick={handleCloseModal} />
      </div>
      <div className="p-4">{children}</div>
      <div className="grid grid-cols-2 gap-2 p-2">
        <Button className="btn-outline" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button
          className={clsx(dangerAction ? 'btn-error' : 'btn-primary', 'btn-outline')}
          onClick={onConfirm}
          autoFocus
          disabled={loading}
          loading={loading}
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );
};
