import clsx from 'clsx';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import type { MouseEvent } from 'react';

import { useContext } from 'hooks/useContext';
import type { MODAL_NAMES } from 'utils/constants';

interface Props {
  name: MODAL_NAMES;
  mobileFullscreen?: boolean;
  onClose?: () => void;
}

const _Modal: React.FC<Props> = ({ name, mobileFullscreen, onClose, children }) => {
  const { modal, handleCloseModal } = useContext();
  const open = modal === name;
  const modalRef = useRef<HTMLDivElement>(null);
  const [el] = useState(() => document.createElement('div'));

  useEffect(() => {
    const modalRoot = document.getElementById('main');

    if (!modalRoot) {
      throw Error('Modal root not found!');
    }

    modalRoot.appendChild(el);

    return (): void => {
      modalRoot.removeChild(el);
    };
  }, [el]);

  // Prevent body scrolling when modal is open.
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'inherit';
    }

    return (): void => {
      document.body.style.overflow = 'inherit';
    };
  }, [open]);

  const handleBackdropClick = ({ target }: MouseEvent): void => {
    if (!modalRef.current?.contains(target as Node)) {
      if (onClose) {
        onClose();
      } else {
        handleCloseModal();
      }
    }
  };

  const renderModal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur backdrop-filter"
      onClick={handleBackdropClick}
    >
      <div
        className={clsx(
          'card-bordered card max-h-full rounded-lg bg-base-100',
          mobileFullscreen && 'h-full sm:h-auto',
        )}
        ref={modalRef}
      >
        {children}
      </div>
    </div>
  );

  return open ? ReactDOM.createPortal(renderModal, el) : null;
};

export const Modal = dynamic(() => Promise.resolve(_Modal), { ssr: false });
