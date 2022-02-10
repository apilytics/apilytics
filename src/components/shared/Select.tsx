import clsx from 'clsx';
import React from 'react';

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select: React.FC<Props> = ({ label, className, children, ...props }) => (
  <select className={clsx('select-bordered select', className)} {...props}>
    {!!label && (
      <option disabled selected>
        {label}
      </option>
    )}
    {children}
  </select>
);
