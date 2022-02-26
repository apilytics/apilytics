import React from 'react';

import { Layout } from 'components/layout/Layout';
import { UIAlerts } from 'components/layout/UIAlerts';
import type { MainTemplateProps } from 'types';

export const MainTemplate: React.FC<MainTemplateProps> = ({ children, ...props }) => (
  <Layout {...props}>
    <div className="container flex max-w-3xl grow flex-col py-4 lg:pt-16">
      <UIAlerts />
      {children}
    </div>
  </Layout>
);
