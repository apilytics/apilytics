import clsx from 'clsx';
import React from 'react';

interface Props {
  small?: boolean;
}

export const LoadingIndicator: React.FC<Props> = ({ small }) => (
  <div
    className={clsx(
      'animate-spinner rounded-full border-t-2 border-primary ease-linear',
      small ? 'h-12 w-12' : 'h-20 w-20',
    )}
  />
);
