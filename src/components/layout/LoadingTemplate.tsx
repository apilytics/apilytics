import React from 'react';

import { MainTemplate } from 'components/layout/MainTemplate';
import { LoadingIndicator } from 'components/shared/LoadingIndicator';

export const LoadingTemplate: React.FC = () => (
  <MainTemplate headProps={{ title: 'Loading...', loading: true }} headerProps={{ loading: true }}>
    <div className="grow flex items-center justify-center py-40">
      <LoadingIndicator />
    </div>
  </MainTemplate>
);
