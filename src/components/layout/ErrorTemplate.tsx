import React from 'react';

import { MainTemplate } from 'components/layout/MainTemplate';

export const ErrorTemplate: React.FC = () => (
  <MainTemplate title="Something went wrong...">
    <div className="grow flex items-center justify-center">
      <h4>Something went wrong...</h4>
    </div>
  </MainTemplate>
);
