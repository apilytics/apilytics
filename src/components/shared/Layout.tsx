import React from 'react';

import { Footer, Head, Header } from 'components';
import type { HeaderProps, HeadProps } from 'types';

export const Layout: React.FC<HeadProps & HeaderProps> = ({
  noIndex,
  children,
  headerMaxWidth = 'full',
}) => (
  <>
    <Head noIndex={noIndex} />
    <div className="min-h-screen flex flex-col bg-black">
      <div className="grow flex flex-col">
        <Header headerMaxWidth={headerMaxWidth} />
        <div className="grow">{children}</div>
        <Footer />
      </div>
    </div>
  </>
);
