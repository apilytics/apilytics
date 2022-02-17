import React from 'react';

import { MainTemplate } from 'components/layout/MainTemplate';

export const ErrorTemplate: React.FC = () => (
  <MainTemplate headProps={{ title: 'Error', error: true }}>
    <div className="flex grow items-center justify-center">
      <h4>Something went wrong...</h4>
    </div>
  </MainTemplate>
);
