import clsx from 'clsx';
import React from 'react';

import type { ButtonProps } from 'types';

export const Button: React.FC<ButtonProps> = ({
  fullWidth = false,
  loading,
  tooltip,
  className,
  endIcon: EndIcon,
  children,
  ...props
}) => {
  const _width = fullWidth === true ? 'w-full' : fullWidth === 'mobile' && 'w-full lg:auto';
  const _loading = loading && 'loading';

  return (
    <div data-tip={tooltip} className={clsx(tooltip && 'tooltip')}>
      <button className={clsx('btn', _width, _loading, className)} {...props}>
        {children} {!!EndIcon && <EndIcon className="w-5 h-5 ml-2" />}
      </button>
    </div>
  );
};
