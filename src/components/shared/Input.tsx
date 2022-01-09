import { ArrowSmRightIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import React, { ReactNode } from 'react';
import { Button } from 'components/shared/Button';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: JSX.Element | string;
  endIcon?: ReactNode;
  onButtonClick?: () => void;
  buttonTooltip?: string;
  loading?: boolean;
}

export const Input: React.FC<Props> = ({
  label,
  helperText,
  className,
  endIcon: EndIcon,
  onButtonClick,
  loading,
  buttonTooltip,
  ...props
}) => (
  <div className="form-control">
    <label className="label">
      <span className="label-text">
        {label} {props.required && <span className="text-error">*</span>}
      </span>
    </label>
    <div className="flex">
      <input
        className={clsx('input input-bordered w-full', EndIcon && 'rounded-r-none', className)}
        {...props}
      />
      {EndIcon && (
        <div data-tip={buttonTooltip} className={clsx(buttonTooltip && 'tooltip')}>
          <Button
            type="button"
            className="rounded-l-none btn-outline"
            loading={loading}
            onClick={onButtonClick}
          >
            <EndIcon className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
    {helperText && (
      <label className="label">
        <span className="label-text-alt">{helperText}</span>
      </label>
    )}
  </div>
);
