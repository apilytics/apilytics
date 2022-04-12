import React from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: JSX.Element | string;
  helperText?: JSX.Element | string;
}

export const Toggle: React.FC<Props> = ({ label, helperText, ...inputProps }) => (
  <div className="form-control my-5">
    <label className="label cursor-pointer">
      <span className="label-text">{label}</span>
      <input type="checkbox" className="toggle-primary toggle" {...inputProps} />
    </label>
    {helperText && (
      <label className="label">
        <span className="label-text-alt">{helperText}</span>
      </label>
    )}
  </div>
);
