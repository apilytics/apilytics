import clsx from 'clsx';
import React from 'react';
import type { ComponentProps } from 'react';

import { IconButton } from 'components/shared/IconButton';
import type { ButtonProps } from 'types';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: JSX.Element | string;
  endIcon?: React.FC<ComponentProps<'svg'>>;
  buttonTooltip?: string;
  loading?: boolean;
  buttonProps?: ButtonProps;
}

export const Input: React.FC<Props> = ({
  label,
  helperText,
  className,
  endIcon: EndIcon,
  buttonProps,
  ...inputProps
}) => (
  <div className="form-control">
    <label className="label">
      <span className="label-text">
        {label} {inputProps.required && <span className="text-error">*</span>}
      </span>
    </label>
    <div className="flex">
      <input
        className={clsx('input input-bordered w-full', EndIcon && 'rounded-r-none', className)}
        {...inputProps}
      />
      {!!EndIcon && (
        <IconButton
          icon={EndIcon}
          type="button"
          className={clsx('rounded-l-none btn-outline', buttonProps?.className)}
          {...buttonProps}
        />
      )}
    </div>
    {helperText && (
      <label className="label">
        <span className="label-text-alt">{helperText}</span>
      </label>
    )}
  </div>
);
