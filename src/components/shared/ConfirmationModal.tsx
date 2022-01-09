import { XIcon } from '@heroicons/react/solid';
import React, { useRef } from 'react';
import type { MouseEvent } from 'react';

import { Button } from 'components/shared/Button';

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
            <Button className="btn-outline btn-circle border-none p-1 ml-auto" onClick={onCancel}>
              <XIcon className="w-5 h-5" />
            </Button>
          </div>
          <div className="p-4">
            <h1 className="text-2xl">{text}</h1>
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
