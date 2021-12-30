import React from 'react';

import { LoadingIndicator } from 'components/shared/LoadingIndicator';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  transparent?: boolean;
  loading?: boolean;
}

export const Button: React.FC<Props> = ({
  color = 'primary',
  variant = 'contained',
  fullWidth = false,
  transparent,
  className,
  loading,
  disabled,
  children,
  ...props
}) => (
  <button
    className={`${
      color === 'primary'
        ? variant === 'contained'
          ? `${transparent ? 'bg-transparent' : 'bg-primary hover:bg-primary-light'} text-white`
          : `${transparent ? 'bg-transparent' : 'bg-white hover:bg-gray-200'} text-primary`
        : variant === 'contained'
        ? 'bg-white text-primary'
        : ''
    }  ${
      fullWidth ? 'lg:w-full' : 'lg:w-auto'
    } border-primary rounded-lg py-2 px-3 text-2xl w-full flex justify-center items-center disabled:opacity-50 ${className}`}
    disabled={disabled || loading}
    {...props}
  >
    {children} {loading && <LoadingIndicator className="ml-4" />}
  </button>
);
