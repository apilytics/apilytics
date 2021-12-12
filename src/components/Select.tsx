import React from 'react';

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  helperText?: string;
}

export const Select: React.FC<Props> = ({ label, helperText, className, ...props }) => (
  <div className="py-2">
    <label className="block text-white text-lg" htmlFor={props.name}>
      {label} {props.required && <span className="text-red-500">*</span>}
    </label>
    <select
      id={props.name}
      className={`block border-primary rounded text-xl p-4 w-full my-2 ${className}`}
      {...props}
    />
    {helperText && <p className="text-secondary text-lg">{helperText}</p>}
  </div>
);
