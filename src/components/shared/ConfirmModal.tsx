import clsx from 'clsx';
import React from 'react';

import { Button } from 'components/shared/Button';
import { Modal } from 'components/shared/Modal';
import { ModalCloseButton } from 'components/shared/ModalCloseButton';
import { useContext } from 'hooks/useContext';
import type { MODAL_NAMES } from 'utils/constants';

interface Props {
  title: string;
  name: MODAL_NAMES;
  onConfirm: () => void;
  onClose?: () => void;
  submitting: boolean;
  dangerAction?: boolean;
}

export const ConfirmModal: React.FC<Props> = ({
  title,
  name,
  onConfirm,
  onClose,
  submitting,
  dangerAction,
  children,
}) => {
  const { handleCloseModal: _handleCloseModal } = useContext();

  const handleCloseModal = (): void => {
    _handleCloseModal();

    if (onClose) {
      onClose();
    }
  };

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
          className={clsx(
            dangerAction ? 'btn-error' : 'btn-primary',
            !submitting && 'btn-outline', // `btn-outline` won't with `disabled` attribute.
          )}
          onClick={onConfirm}
          autoFocus
          disabled={submitting}
          loading={submitting}
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );
};
