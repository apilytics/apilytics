import clsx from 'clsx';
import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  colorClass?: 'btn-primary' | 'btn-secondary' | 'btn-error';
  variantClass?: 'btn-outline';
  fullWidth?: boolean | 'mobile';
  loading?: boolean;
}

export const Button: React.FC<Props> = ({
  colorClass = 'btn-primary',
  variantClass,
  fullWidth = false,
  loading,
  disabled,
  className,
  children,
  ...props
}) => {
  const _width = fullWidth === true ? 'w-full' : fullWidth === 'mobile' && 'w-full lg:auto';
  const _loading = loading && 'loading';

  return (
    <button
      className={clsx('btn', colorClass, variantClass, _width, _loading, className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
