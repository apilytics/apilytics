import clsx from 'clsx';
import React from 'react';

interface Props {
  grow?: boolean;
}

export const DashboardCard: React.FC<Props> = ({ children }) => (
  <div className={clsx('card rounded-lg bg-base-100 p-2')}>{children}</div>
);
