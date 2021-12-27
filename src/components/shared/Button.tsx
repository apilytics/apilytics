import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  transparent?: boolean;
}

export const Button: React.FC<Props> = ({
  color = 'primary',
  variant = 'contained',
  fullWidth = false,
  transparent,
  className,
  ...props
}) => (
  <button
    className={`${
      color === 'primary'
        ? variant === 'contained'
          ? `${transparent ? 'bg-transparent' : 'bg-primary'} text-white`
          : `${transparent ? 'bg-transparent' : 'bg-white'} text-primary`
        : variant === 'contained'
        ? 'bg-white text-primary'
        : ''
    }  ${
      fullWidth ? 'lg:w-full' : 'lg:w-auto'
    } border-primary rounded-lg py-2 px-3 text-2xl w-full flex justify-center items-center disabled:opacity-50 ${className}`}
    {...props}
  />
);
