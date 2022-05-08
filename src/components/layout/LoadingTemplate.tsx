import React from 'react';

import { MainTemplate } from 'components/layout/MainTemplate';
import { LoadingIndicator } from 'components/shared/LoadingIndicator';

export const LoadingTemplate: React.FC = () => (
  <MainTemplate headProps={{ title: 'Loading...', loading: true }}>
    <div className="flex grow items-center justify-center p-5">
      <LoadingIndicator />
    </div>
  </MainTemplate>
);
