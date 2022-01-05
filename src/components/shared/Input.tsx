import React from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
}

export const Input: React.FC<Props> = ({ label, helperText, ...props }) => (
  <div className="form-control">
    <label className="label">
      <span className="label-text">
        {label} {props.required && <span className="text-error">*</span>}
      </span>
    </label>
    <input className={'input'} {...props} />
    {helperText && (
      <label className="label">
        <span className="label-text-alt">{helperText}</span>
      </label>
    )}
  </div>
);
