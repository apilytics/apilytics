import clsx from 'clsx';
import React from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: JSX.Element | string;
  helperText?: JSX.Element | string;
  formControlProps?: React.HTMLAttributes<HTMLDivElement>;
}

export const Input: React.FC<Props> = ({ label, helperText, formControlProps, ...inputProps }) => (
  <div {...formControlProps} className={clsx('form-control my-1', formControlProps?.className)}>
    {label && (
      <label className="label">
        <span className="label-text">
          {label} {inputProps.required && <span className="text-error">*</span>}
        </span>
      </label>
    )}
    <input className="input-bordered input" {...inputProps} />
    {helperText && (
      <label className="label">
        <span className="label-text-alt">{helperText}</span>
      </label>
    )}
  </div>
);
