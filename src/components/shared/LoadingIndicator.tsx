import React from 'react';
import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

export const LoadingIndicator: React.FC<Props> = ({ size = 6, className, ...props }) => (
  <div
    className={`animate-spinner ease-linear rounded-full border-2 border-t-primary h-${size} w-${size} ${
      className ?? ''
    }`}
    {...props}
  />
);
