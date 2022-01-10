import { XIcon } from '@heroicons/react/solid';
import React, { useRef } from 'react';
import type { MouseEvent } from 'react';

import { Button } from 'components/shared/Button';
import { IconButton } from 'components/shared/IconButton';

interface Props {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  text: string;
}

export const ConfirmationModal: React.FC<Props> = ({ open, onConfirm, onCancel, text }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClick = ({ target }: MouseEvent): void => {
    if (!modalRef.current?.contains(target as Node)) {
      onCancel();
    }
  };

  return open ? (
    <div
      className="fixed inset-0 z-50 backdrop-filter backdrop-blur flex justify-center items-center animate-fade-in-top"
      onClick={handleClick}
    >
      <div className="mx-auto w-96">
        <div className="card rounded-lg p-4 shadow bg-base-100 flex flex-col w-full" ref={modalRef}>
          <div className="flex items-start justify-between p-2">
            <IconButton className="ml-auto" onClick={onCancel} icon={XIcon} />
          </div>
          <div className="p-4">
            <p>{text}</p>
          </div>
          <div className="p-2 grid grid-cols-2 gap-2">
            <Button className="btn-error btn-outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button className="btn-primary" onClick={onConfirm} autoFocus>
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};
