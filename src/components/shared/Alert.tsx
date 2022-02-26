import { XIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import React from 'react';

import { IconButton } from 'components/shared/IconButton';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  onDismiss: () => void;
}

export const Alert: React.FC<Props> = ({ text, onDismiss, className, ...props }) => (
  <div className={clsx('alert', className)} {...props}>
    <p>{text}</p>
    <IconButton icon={XIcon} onClick={onDismiss} />
  </div>
);
