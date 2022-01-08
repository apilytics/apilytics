import clsx from 'clsx';
import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean | 'mobile';
  loading?: boolean;
}

export const Button: React.FC<Props> = ({
  fullWidth = false,
  loading,
  className,
  children,
  ...props
}) => {
  const _width = fullWidth === true ? 'w-full' : fullWidth === 'mobile' && 'w-full lg:auto';
  const _loading = loading && 'loading';

  return (
    <button className={clsx('btn', _width, _loading, className)} {...props}>
      {children}
    </button>
  );
};
