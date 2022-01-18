import clsx from 'clsx';
import React from 'react';

import { Layout } from 'components/layout/Layout';
import type { LayoutProps } from 'types';

interface Props extends LayoutProps {
  dense?: boolean;
}

export const MainTemplate: React.FC<Props> = ({
  maxWidth = 'max-w-3xl',
  dense = false,
  children,
  ...props
}) => (
  <Layout maxWidth={maxWidth} {...props}>
    <div
      className={clsx(
        'container py-4 animate-fade-in-top grow flex flex-col',
        maxWidth,
        !dense && 'lg:pt-16',
      )}
    >
      {children}
    </div>
  </Layout>
);
