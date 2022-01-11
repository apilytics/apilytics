import React, { useEffect, useRef } from 'react';
import type { MouseEvent } from 'react';

import { useModal } from 'hooks/useModal';

export const Modal: React.FC = () => {
  const { modalContent, handleCloseModal } = useModal();
  const modalRef = useRef<HTMLDivElement>(null);

  // Prevent body scrolling when modal is open.
  useEffect(() => {
    if (modalContent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'inherit';
    }
  }, [modalContent]);

  const handleClick = ({ target }: MouseEvent): void => {
    if (!modalRef.current?.contains(target as Node)) {
      handleCloseModal();
    }
  };

  return modalContent ? (
    <div
      className="fixed inset-0 z-50 backdrop-blur backdrop-filter flex justify-center items-center"
      onClick={handleClick}
    >
      <div className="mx-auto w-full sm:w-96">
        <div
          className="card card-bordered rounded-lg bg-base-100 flex flex-col h-screen sm:max-h-128 sm:h-auto animate-fade-in-top"
          ref={modalRef}
        >
          {modalContent}
        </div>
      </div>
    </div>
  ) : null;
};
