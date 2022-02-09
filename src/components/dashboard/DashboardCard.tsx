import clsx from 'clsx';
import React from 'react';

interface Props {
  grow?: boolean;
}

export const DashboardCard: React.FC<Props> = ({ children }) => (
  <div className={clsx('bg-base-100 card shadow rounded-lg p-2')}>{children}</div>
);
