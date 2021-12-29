import React from 'react';

import { Footer } from 'components/layout/Footer';
import { Head } from 'components/layout/Head';
import { Header } from 'components/layout/Header';
import type { HeaderProps, HeadProps } from 'types';

export const Layout: React.FC<HeadProps & HeaderProps> = ({
  noIndex,
  children,
  headerMaxWidth = 'full',
  hideLogin,
}) => (
  <>
    <Head noIndex={noIndex} />
    <div className="min-h-screen flex flex-col bg-black">
      <div className="grow flex flex-col">
        <Header headerMaxWidth={headerMaxWidth} hideLogin={hideLogin} />
        <div className="grow flex flex-col relative">{children}</div>
        <Footer />
      </div>
    </div>
  </>
);
