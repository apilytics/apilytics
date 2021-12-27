import NextHead from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { DESCRIPTION, FRONTEND_URL, TITLE } from 'utils/constants';
import { routes } from 'utils/router';
import type { HeadProps } from 'types';

const OG_IMAGE = `${FRONTEND_URL}/og-image.png`;

export const Head: React.FC<HeadProps> = ({ noIndex }) => {
  const { asPath } = useRouter();
  const ogUrl = `${FRONTEND_URL}${asPath === routes.root ? '' : asPath}`;

  return (
    <NextHead>
      <title>{TITLE}</title>
      <meta name="description" content={DESCRIPTION} />
      <link rel="shortcut icon" href="favicon.ico" />
      <meta property="og:title" content={TITLE} />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta name="twitter:title" content={TITLE} />
      <meta name="twitter:description" content={DESCRIPTION} />
      <meta name="twitter:image" content={OG_IMAGE} />
      {noIndex && <meta name="robots" content="noindex,noarchive,nosnippet,follow" />}
    </NextHead>
  );
};
