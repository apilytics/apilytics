import React from 'react';

import { Footer } from 'components/layout/Footer';
import { Head } from 'components/layout/Head';
import { Header } from 'components/layout/Header';
import type { LayoutProps } from 'types';

export const Layout: React.FC<LayoutProps> = ({
  headProps,
  headerProps,
  footerProps,
  children,
}) => (
  <>
    <Head {...headProps} />
    <div className="flex min-h-screen flex-col bg-base-200">
      <div id="main" className="flex grow flex-col">
        <Header {...headerProps} />
        <div className="relative flex grow flex-col">{children}</div>
        <Footer {...footerProps} />
      </div>
    </div>
  </>
);
