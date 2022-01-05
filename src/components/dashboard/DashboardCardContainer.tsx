import React from 'react';

import { LoadingIndicator } from 'components/shared/LoadingIndicator';

interface Props {
  loading: boolean;
}

export const DashboardCardContainer: React.FC<Props> = ({ loading, children }) => (
  <div className="bg-base-100 card card-bordered rounded-lg flex flex-col p-2 grow">
    {loading ? (
      <div className="grow flex justify-center items-center">
        <LoadingIndicator small />
      </div>
    ) : (
      children
    )}
  </div>
);
