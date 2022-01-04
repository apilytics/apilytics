import clsx from 'clsx';
import React from 'react';
import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

export const LoadingIndicator: React.FC<Props> = ({ size = 8 }) => (
  <div
    className={clsx(
      'animate-spinner ease-linear rounded-full border-t-2 border-primary',
      `h-${size} w-${size}`,
    )}
  />
);
