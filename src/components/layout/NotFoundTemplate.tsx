import React from 'react';

import { MainTemplate } from 'components/layout/MainTemplate';

export const NotFoundTemplate: React.FC = () => (
  <MainTemplate headProps={{ title: 'Not found...' }}>
    <div className="flex grow items-center justify-center">
      <h4>Not found...</h4>
    </div>
  </MainTemplate>
);
