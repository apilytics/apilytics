import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export const Button: React.FC<Props> = ({
  variant = 'primary',
  fullWidth = false,
  className,
  ...props
}) => (
  <button
    className={`${
      variant === 'primary' ? 'bg-primary text-white' : 'bg-white text-primary border-primary'
    } ${
      fullWidth ? 'lg:w-full' : 'lg:w-auto'
    } rounded-lg p-4 text-2xl w-full flex justify-center items-center disabled:opacity-50 ${className}`}
    {...props}
  />
);
