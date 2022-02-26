import { useContext } from 'react';

import { UIStateContext } from 'context/uiState';
import type { UIStateContextType } from 'types';

export const useUIState = (): UIStateContextType => {
  const context = useContext(UIStateContext);

  if (!context) {
    throw new Error('useUIState must be used within ModalProvider');
  }

  return context;
};
