import clsx from 'clsx';
import React from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: JSX.Element | string;
  helperText?: JSX.Element | string;
}

export const Radio: React.FC<Props> = ({ label, helperText, className, ...inputProps }) => (
  <div className="form-control">
    <label className="label cursor-pointer">
      <span className="text-white">{label}</span>
      <input type="radio" className={clsx('radio-primary radio', className)} {...inputProps} />
    </label>
    {helperText && (
      <label className="label">
        <span className="label-text-alt">{helperText}</span>
      </label>
    )}
  </div>
);
