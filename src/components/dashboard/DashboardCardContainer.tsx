import clsx from 'clsx';
import React from 'react';

import { LoadingIndicator } from 'components/shared/LoadingIndicator';

interface Props {
  loading: boolean;
  grow?: boolean;
}

export const DashboardCardContainer: React.FC<Props> = ({ loading, grow, children }) => (
  <div
    className={clsx(
      'bg-base-100 card shadow rounded-lg flex flex-col p-2',
      (grow || loading) && 'grow',
    )}
  >
    {loading ? (
      <div className="grow flex justify-center items-center">
        <LoadingIndicator small />
      </div>
    ) : (
      children
    )}
  </div>
);
