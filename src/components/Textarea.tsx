import React from 'react';

export interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helperText?: string;
}

export const Textarea: React.FC<Props> = ({ label, helperText, className, ...props }) => (
  <div className="py-2">
    <label className="block text-white text-lg" htmlFor={props.name}>
      {label} {props.required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      id={props.name}
      className={`block outline-primary rounded text-xl p-4 w-full my-2 ${className}`}
      {...props}
    />
    {helperText && <p className="text-secondary text-lg">{helperText}</p>}
  </div>
);
