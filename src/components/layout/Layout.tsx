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
    <div className="min-h-screen flex flex-col bg-base-200">
      <div id="main" className="grow flex flex-col">
        <Header {...headerProps} />
        <div className="grow flex flex-col relative">{children}</div>
        <Footer {...footerProps} />
      </div>
    </div>
  </>
);
