import { createContext, useState } from 'react';

import type { ModalContextType } from 'types';

export const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider: React.FC = ({ children }) => {
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const handleCloseModal = (): void => setModalContent(null);

  const value = {
    modalContent,
    setModalContent,
    handleCloseModal,
  };

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};
