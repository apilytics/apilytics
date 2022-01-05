import clsx from 'clsx';
import React from 'react';

const COLORS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  error: 'btn-error',
};

const VARIANTS = {
  contained: '',
  outlined: 'btn-outline',
};

const FULL_WIDTHS = {
  true: 'w-full',
  mobile: 'w-full lg:w-auto',
};

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'primary' | 'secondary' | 'error';
  variant?: 'outlined';
  fullWidth?: boolean | 'mobile';
  loading?: boolean;
}

export const Button: React.FC<Props> = ({
  color = 'primary',
  variant = 'contained',
  fullWidth = false,
  loading,
  disabled,
  className,
  children,
  ...props
}) => (
  <button
    className={clsx(
      'btn',
      COLORS[color],
      VARIANTS[variant as keyof typeof VARIANTS],
      FULL_WIDTHS[String(fullWidth) as keyof typeof FULL_WIDTHS],
      loading && 'loading',
      className,
    )}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);
