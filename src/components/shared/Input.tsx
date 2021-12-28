import React from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
}

export const Input: React.FC<Props> = ({ label, helperText, className, ...props }) => (
  <div className="py-2">
    <label className="block text-white text-lg" htmlFor={props.name}>
      {label} {props.required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={props.name}
      className={`block border-primary rounded-xl text-xl py-2 px-3 w-full my-2 ${className}`}
      {...props}
    />
    {helperText && <p className="text-secondary text-lg">{helperText}</p>}
  </div>
);
