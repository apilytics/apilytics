import React from 'react';

import { MainTemplate } from 'components/layout/MainTemplate';
import { LoadingIndicator } from 'components/shared/LoadingIndicator';

export const LoadingTemplate: React.FC = () => (
  <MainTemplate>
    <div className="grow flex items-center justify-center">
      <LoadingIndicator size={8} />
    </div>
  </MainTemplate>
);
