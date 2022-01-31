import React from 'react';

import { Head } from 'components/layout/Head';
import { LoadingIndicator } from 'components/shared/LoadingIndicator';

export const LoadingTemplate: React.FC = () => (
  <>
    <Head title="Loading..." loading />
    <div className="h-screen flex items-center justify-center">
      <LoadingIndicator />
    </div>
  </>
);
