import { createContext, useState } from 'react';

import type { ModalContextType } from 'types';

export const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider: React.FC = ({ children }) => {
  const [modal, setModal] = useState<string | null>(null);
  const handleOpenModal = (name: string): void => setModal(name);
  const handleCloseModal = (): void => setModal(null);

  const value = {
    modal,
    handleOpenModal,
    handleCloseModal,
  };

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};
