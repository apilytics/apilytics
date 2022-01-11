import { useContext } from 'react';

import { ModalContext } from 'context/modal';
import type { ModalContextType } from 'types';

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }

  return context;
};
