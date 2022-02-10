import { ArrowLeftIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import React from 'react';

import { Button } from 'components/shared/Button';
import type { ButtonProps } from 'types';

interface Props extends ButtonProps {
  text: string;
}

export const BackButton: React.FC<Props> = ({ text, className, ...props }) => (
  <Button
    {...props}
    className={clsx('btn-primary btn-link self-start p-0', className)}
    startIcon={ArrowLeftIcon}
  >
    {text}
  </Button>
);
