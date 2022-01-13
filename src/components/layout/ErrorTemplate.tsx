import React from 'react';

import { MainTemplate } from 'components/layout/MainTemplate';

export const ErrorTemplate: React.FC = () => (
  <MainTemplate>
    <div className="grow flex items-center justify-center">
      <h4>Something went wrong...</h4>
    </div>
  </MainTemplate>
);
