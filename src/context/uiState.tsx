import { createContext, useState } from 'react';

import type { UIStateContextType } from 'types';

export const UIStateContext = createContext<UIStateContextType | null>(null);

export const UIStateProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [modal, setModal] = useState<string | null>(null);
  const handleOpenModal = (name: string): void => setModal(name);
  const handleCloseModal = (): void => setModal(null);

  const value = {
    loading,
    setLoading,
    successMessage,
    setSuccessMessage,
    errorMessage,
    notFound,
    setNotFound,
    setErrorMessage,
    modal,
    handleOpenModal,
    handleCloseModal,
  };

  return <UIStateContext.Provider value={value}>{children}</UIStateContext.Provider>;
};
