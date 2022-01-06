import React from 'react';

import { MainTemplate } from 'components/layout/MainTemplate';

export const NotFoundTemplate: React.FC = () => (
  <MainTemplate>
    <div className="grow flex items-center justify-center">
      <h1 className="text-xl text-primary">Not found...</h1>
    </div>
  </MainTemplate>
);