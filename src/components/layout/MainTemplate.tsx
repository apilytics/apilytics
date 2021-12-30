import React from 'react';

import { Layout } from 'components/layout/Layout';
import type { LayoutProps } from 'types';

interface Props extends LayoutProps {
  maxWidth?: '3xl' | '5xl';
}

export const MainTemplate: React.FC<Props> = ({
  maxWidth = '3xl',
  noIndex = true,
  hideLogin = false,
  children,
}) => (
  <Layout noIndex={noIndex} maxWidth={maxWidth} hideLogin={hideLogin}>
    <div className="bg-background bg-no-repeat bg-cover flex grow">
      <div className="bg-filter grow flex">
        <div
          className={`container max-w-${maxWidth} py-16 animate-fade-in-top animation-delay-400 flex flex-col`}
        >
          {children}
        </div>
      </div>
    </div>
  </Layout>
);
