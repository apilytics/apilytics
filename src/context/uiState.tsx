import { createContext, useState } from 'react';

import type { UIStateContextType } from 'types';
import type { MODAL_NAMES } from 'utils/constants';

export const UIStateContext = createContext<UIStateContextType | null>(null);

export const UIStateProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [modal, setModal] = useState<MODAL_NAMES | null>(null);
  const handleOpenModal = (name: MODAL_NAMES): void => setModal(name);
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
