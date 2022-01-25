import clsx from 'clsx';
import React from 'react';

import { Layout } from 'components/layout/Layout';
import { DEFAULT_MAX_WIDTH } from 'utils/constants';
import type { MainTemplateProps } from 'types';

export const MainTemplate: React.FC<MainTemplateProps> = ({
  maxWidth = DEFAULT_MAX_WIDTH,
  dense = false,
  children,
  ...props
}) => (
  <Layout {...props} maxWidth={maxWidth}>
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
