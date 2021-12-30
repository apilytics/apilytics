import React from 'react';

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
}

export const Select: React.FC<Props> = ({
  label,
  helperText,
  className,
  containerProps,
  ...props
}) => (
  <div {...containerProps} className={`py-2 ${containerProps?.className || ''}`}>
    {label && (
      <label className="block text-white text-lg" htmlFor={props.name}>
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>
    )}
    <select
      id={props.name}
      className={`block border-secondary rounded-lg text-xl py-1 px-2 px-y w-full my-2 text-primary bg-zinc-800 ${className}`}
      {...props}
    />
    {helperText && <p className="text-secondary text-lg">{helperText}</p>}
  </div>
);
