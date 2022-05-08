import { XIcon } from '@heroicons/react/solid';
import React from 'react';

import { IconButton } from 'components/shared/IconButton';

interface Props {
  onClick: () => void;
}

export const ModalCloseButton: React.FC<Props> = ({ onClick }) => (
  <IconButton className="btn-sm" icon={XIcon} onClick={onClick} />
);
