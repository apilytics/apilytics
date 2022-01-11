import { XIcon } from '@heroicons/react/solid';
import React from 'react';

import { IconButton } from 'components/shared/IconButton';
import { useModal } from 'hooks/useModal';

export const ModalCloseButton: React.FC = () => {
  const { handleCloseModal } = useModal();
  return <IconButton className="btn-sm" icon={XIcon} onClick={handleCloseModal} />;
};
