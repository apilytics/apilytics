import clsx from 'clsx';
import React from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
}

export const Input: React.FC<Props> = ({ label, helperText, className, ...props }) => (
  <div className="form-control">
    <label className="label">
      <span className="label-text">
        {label} {props.required && <span className="text-error">*</span>}
      </span>
    </label>
    <input className={clsx('input', className)} {...props} />
    {helperText && (
      <label className="label">
        <span className="label-text-alt">{helperText}</span>
      </label>
    )}
  </div>
);
