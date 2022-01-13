import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';

import type { ButtonProps } from 'types';

export const Button: React.FC<ButtonProps> = ({
  fullWidth = false,
  loading,
  tooltip,
  className,
  endIcon: EndIcon,
  linkTo,
  children,
  ...props
}) => {
  const _width = fullWidth === true ? 'w-full' : fullWidth === 'mobile' && 'w-full sm:w-auto';
  const _loading = loading && 'loading';

  let renderButton = (
    <button className={clsx('btn', _width, _loading, className)} {...props}>
      {children} {!!EndIcon && <EndIcon className="w-5 h-5 ml-2" />}
    </button>
  );

  if (linkTo) {
    renderButton = (
      <Link href={linkTo}>
        <a className="unstyled contents">{renderButton}</a>
      </Link>
    );
  }

  if (tooltip) {
    return (
      <div data-tip={tooltip} className={clsx(tooltip && 'tooltip')}>
        {renderButton}
      </div>
    );
  }

  return renderButton;
};
