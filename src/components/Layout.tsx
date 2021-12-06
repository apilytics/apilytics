import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const TITLE = 'Monitor & analyze your API';

const DESCRIPTION =
  'Apilytics is a SaaS service that helps you monitor & analyse performance and security analytics and metrics from your API, throttle requests and much more!';

const OG_IMAGE = '/og-image.png';

interface Props {
  dense?: boolean;
  noIndex?: boolean;
  customTags?: JSX.Element;
}

export const Layout: React.FC<Props> = ({ dense, noIndex, children }) => (
  <div className="min-h-screen flex flex-col">
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
    <header className="h-20 flex items-center bg-gray-100">
      <div className={`container p-5 ${dense ? 'max-w-4xl' : ''}`}>
        <Link href="/">
          <a>
            <Image
              src="/logo.png"
              layout="fixed"
              width={100}
              height={60}
              objectFit="contain"
              alt="Logo"
            />
          </a>
        </Link>
      </div>
    </header>
    <div className={`container flex-grow p-5 ${dense ? 'max-w-4xl mx-auto' : ''}`}>{children}</div>
    <footer className="p-5 text-center bg-gray-100">
      <div className={`container text-gray-500 ${dense ? 'max-w-4xl mx-auto' : ''}`}>
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
);
