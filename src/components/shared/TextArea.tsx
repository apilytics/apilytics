import clsx from 'clsx';
import React from 'react';

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helperText?: JSX.Element | string;
}

export const TextArea: React.FC<Props> = ({ label, helperText, className, ...props }) => (
  <div className="form-control">
    <label className="label">
      <span className="label-text">
        {label} {props.required && <span className="text-error">*</span>}
      </span>
    </label>
    <textarea className={clsx('textarea-bordered textarea', className)} {...props} />
    {helperText && (
      <label className="label">
        <span className="label-text-alt">{helperText}</span>
      </label>
    )}
  </div>
);
