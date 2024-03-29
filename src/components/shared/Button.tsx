import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';

import type { ButtonProps } from 'types';

export const Button: React.FC<ButtonProps> = ({
  fullWidth = false,
  loading,
  className,
  startIcon: StartIcon,
  endIcon: EndIcon,
  linkTo,
  disabled,
  children,
  ...props
}) => {
  const _width = fullWidth === true ? 'w-full' : fullWidth === 'mobile' && 'w-full sm:w-auto';
  const _loading = loading && 'loading';
  const _disabled = disabled && 'btn-disabled';

  let renderButton = (
    <button
      className={clsx('btn', _width, _loading, _disabled, className)}
      disabled={disabled}
      {...props}
    >
      {!!StartIcon && <StartIcon className="mr-2 h-5 w-5" />} {children}{' '}
      {!!EndIcon && <EndIcon className="ml-2 h-5 w-5" />}
    </button>
  );

  if (linkTo) {
    renderButton = (
      <Link href={linkTo}>
        <a className="unstyled contents">{renderButton}</a>
      </Link>
    );
  }

  return renderButton;
};
