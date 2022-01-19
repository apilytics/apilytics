import clsx from 'clsx';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import type { MouseEvent } from 'react';

import { useModal } from 'hooks/useModal';

interface Props {
  name: string;
  mobileFullscreen?: boolean;
}

const _Modal: React.FC<Props> = ({ name, mobileFullscreen, children }) => {
  const { modal, handleCloseModal } = useModal();
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
      handleCloseModal();
    }
  };

  const renderModal = (
    <div
      className="fixed inset-0 z-50 backdrop-blur backdrop-filter flex justify-center items-center"
      onClick={handleBackdropClick}
    >
      <div className={clsx('mx-auto w-128', mobileFullscreen && 'h-full sm:h-auto')}>
        <div
          className={clsx(
            'card card-bordered rounded-lg bg-base-100 flex flex-col max-h-128 animate-fade-in-top',
            mobileFullscreen ? 'h-full max-h-full sm:h-auto sm:max-h-128' : 'h-auto',
          )}
          ref={modalRef}
        >
          {children}
        </div>
      </div>
    </div>
  );

  return open ? ReactDOM.createPortal(renderModal, el) : null;
};

export const Modal = dynamic<Props>(() => Promise.resolve(_Modal), { ssr: false });
