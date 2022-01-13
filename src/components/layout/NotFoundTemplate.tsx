import React from 'react';

import { MainTemplate } from 'components/layout/MainTemplate';

export const NotFoundTemplate: React.FC = () => (
  <MainTemplate>
    <div className="grow flex items-center justify-center">
      <h4>Not found...</h4>
    </div>
  </MainTemplate>
);
