import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { DESCRIPTION, FRONTEND_URL, TITLE } from 'utils';

interface Props {
  noIndex?: boolean;
  customTags?: JSX.Element;
  headerMaxWidth?: string;
}

export const Layout: React.FC<Props> = ({ noIndex, children, headerMaxWidth = 'full' }) => {
  const { asPath } = useRouter();
  const ogUrl = `${FRONTEND_URL}${asPath === '/' ? '' : asPath}`;
  const ogImage = `${FRONTEND_URL}/og-image.png`;

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="shortcut icon" href="favicon.ico" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={ogImage} />
        {noIndex && <meta name="robots" content="noindex,noarchive,nosnippet,follow" />}
      </Head>
      <div className="grow flex flex-col">
        <header className="h-20 flex items-center">
          <div className={`container animate-fade-in animation-delay-1200 max-w-${headerMaxWidth}`}>
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
          </div>
        </header>
        <div className={'grow'}>{children}</div>
        <footer className="text-center">
          <div className="container py-16 text-secondary mx-auto">
            <p>© 2021 Apilytics</p>
            <p>
              <a href="mailto:hello@apilytics.io">hello@apilytics.io</a>
            </p>
            <p>
              <a href="https://twitter.com/apilytics" target="_blank" rel="noreferrer">
                Twitter
              </a>
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
};
