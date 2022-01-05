import React from 'react';

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select: React.FC<Props> = ({ label, children, ...props }) => (
  <select className={'select select-bordered'} {...props}>
    {!!label && (
      <option disabled selected>
        {label}
      </option>
    )}
    {children}
  </select>
);
