import clsx from 'clsx';
import React from 'react';

import { Layout } from 'components/layout/Layout';
import type { LayoutProps } from 'types';

const MAX_WIDTHS = {
  '3xl': 'max-w-3xl',
  '5xl': 'max-w-5xl',
};

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
          className={clsx(
            'container py-16 animate-fade-in-top flex flex-col',
            MAX_WIDTHS[maxWidth as keyof typeof MAX_WIDTHS],
          )}
        >
          {children}
        </div>
      </div>
    </div>
  </Layout>
);
