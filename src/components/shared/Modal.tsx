import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import type { MouseEvent } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

const _Modal: React.FC<Props> = ({ open, onClose, children }) => {
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
  }, [open]);

  const handleBackdropClick = ({ target }: MouseEvent): void => {
    if (!modalRef.current?.contains(target as Node)) {
      onClose();
    }
  };

  const renderModal = (
    <div
      className="fixed inset-0 z-50 backdrop-blur backdrop-filter flex justify-center items-center"
      onClick={handleBackdropClick}
    >
      <div className="mx-auto w-full sm:w-96">
        <div
          className="card sm:card-bordered sm:rounded-lg bg-base-100 flex flex-col h-screen sm:max-h-128 sm:h-auto animate-fade-in-top"
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
