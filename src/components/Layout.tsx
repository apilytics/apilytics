import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { DESCRIPTION, TITLE } from 'utils';

const OG_IMAGE = '/og-image.png';

interface Props {
  noIndex?: boolean;
  customTags?: JSX.Element;
}

export const Layout: React.FC<Props> = ({ noIndex, children }) => (
  <div className="min-h-screen flex flex-col bg-background bg-no-repeat bg-cover">
    <Head>
      <title>{TITLE}</title>
      <meta name="description" content={DESCRIPTION} />
      <link rel="shortcut icon" href="favicon.ico" />
      <meta property="og:title" content={TITLE} />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:url" content="https://apilytics.io" />
      <meta property="og:image" content={OG_IMAGE} />
      <meta name="twitter:title" content={TITLE} />
      <meta name="twitter:description" content={DESCRIPTION} />
      <meta name="twitter:image" content={OG_IMAGE} />
      {noIndex && <meta name="robots" content="NONE,NOARCHIVE" />}
    </Head>
    <div className="bg-filter">
      <header className="h-20 p-5 flex items-center animate-fade-in animation-delay-1200">
        <div className="container mt-2 max-w-4xl flex items-center justify-between">
          <Link href="/">
            <a>
              <Image
                src="/logo.svg"
                layout="fixed"
                width={100}
                height={80}
                objectFit="contain"
                alt="Logo"
              />
            </a>
          </Link>
          <p className="text-xl text-secondary">Beta</p>
        </div>
      </header>
      <div className="container flex-grow p-5 text-center max-w-4xl mx-auto">{children}</div>
      <footer className="p-5 text-center">
        <div className="container text-gray-500 max-w-4xl mx-auto">
          <p>© 2021 Apilytics</p>
          <p>
            <a href="mailto:hello@apilytics.io">hello@apilytics.io</a>
          </p>
          <p>
            <Link href="/privacy">
              <a>Privacy</a>
            </Link>
          </p>
        </div>
      </footer>
    </div>
  </div>
);
