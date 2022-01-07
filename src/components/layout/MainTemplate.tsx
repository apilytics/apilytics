import clsx from 'clsx';
import React from 'react';

import { Layout } from 'components/layout/Layout';
import type { LayoutProps } from 'types';

interface Props extends Omit<LayoutProps, 'maxWidth'> {
  wide?: boolean;
}

export const MainTemplate: React.FC<Props> = ({ wide, noIndex = true, children }) => {
  const maxWidth = wide ? 'max-w-5xl' : 'max-w-3xl';

  return (
    <Layout noIndex={noIndex} maxWidth={maxWidth}>
      <div
        className={clsx('container py-4 lg:pt-16 animate-fade-in-top grow flex flex-col', maxWidth)}
      >
        {children}
      </div>
    </Layout>
  );
};
