import React from 'react';

import { MainTemplate } from 'components/layout/MainTemplate';

export const NotFoundTemplate: React.FC = () => (
  <MainTemplate>
    <div className="grow flex items-center justify-center">
      <h2>Not found...</h2>
    </div>
  </MainTemplate>
);
