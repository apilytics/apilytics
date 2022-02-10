import clsx from 'clsx';
import React from 'react';
import type { ComponentProps } from 'react';

import { Button } from 'components/shared/Button';
import type { ButtonProps } from 'types';

interface Props extends ButtonProps {
  icon: React.FC<ComponentProps<'svg'>>;
}

export const IconButton: React.FC<Props> = ({ icon: Icon, className, ...props }) => (
  <Button className={clsx('btn-ghost btn-square', className)} {...props}>
    <Icon className="h-5 w-5" />
  </Button>
);
