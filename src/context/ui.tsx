import { useState } from 'react';

import type { UIContextType } from 'types';
import type { MODAL_NAMES } from 'utils/constants';

export const _useUIContext = (): UIContextType => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [modal, setModal] = useState<MODAL_NAMES | null>(null);
  const handleOpenModal = (name: MODAL_NAMES): void => setModal(name);
  const handleCloseModal = (): void => setModal(null);

  return {
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,
    modal,
    handleOpenModal,
    handleCloseModal,
  };
};
