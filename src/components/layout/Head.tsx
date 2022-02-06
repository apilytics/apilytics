import NextHead from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { DEFAULT_SEO_DESCRIPTION } from 'utils/constants';
import { FRONTEND_URL, INDEXABLE_ROUTES, staticRoutes } from 'utils/router';
import type { HeadProps } from 'types';

const OG_IMAGE = `${FRONTEND_URL}/og-image.png`;

export const Head: React.FC<HeadProps> = ({ indexable, title, description, loading }) => {
  const { asPath } = useRouter();
  const ogUrl = `${FRONTEND_URL}${asPath === staticRoutes.root ? '' : asPath}`;
  const _title = `${title} | Apilytics`;
  const _description = description ?? DEFAULT_SEO_DESCRIPTION;

  if (process.env.NODE_ENV !== 'production' && !loading) {
    const path = asPath.split('#')[0].split('?')[0];

    if (INDEXABLE_ROUTES.includes(path) && !indexable) {
      throw Error(`${asPath} is included in sitemap but isn't indexable.`);
    }

    if (indexable) {
      if (!title) {
        throw Error(`${path} is indexable but does not have a custom title.`);
      }

      if (!description) {
        throw Error(`${path} is indexable but does not have a custom description.`);
      }

      if (!INDEXABLE_ROUTES.includes(path)) {
        throw Error(`${path} is indexable but isn't included in the sitemap.`);
      }
    }

    if (_title?.length > 60) {
      throw Error(
        `Title shouldn't be between more than 60 characters for ${path} (${_title} currently).`,
      );
    }

    // The actual minimum length for descriptions is said to be 60 characters but we want
    // to maximize the odds of the search engines indexing our custom descriptions.
    if (_description?.length < 100 || _description?.length > 160) {
      throw Error(
        `Description should be between 100 and 160 characters for ${path} (${_description.length} currently).`,
      );
    }
  }

  return (
    <NextHead>
      <title>{_title}</title>
      <meta name="description" content={_description} />
      <link rel="shortcut icon" href="favicon.ico" />
      <meta property="og:title" content={_title} />
      <meta property="og:description" content={_description} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta name="twitter:title" content={_title} />
      <meta name="twitter:description" content={_description} />
      <meta name="twitter:image" content={OG_IMAGE} />
      {!indexable && <meta name="robots" content="noindex,noarchive,nosnippet,follow" />}
      <meta
        name="viewport"
        content="width=device-width, user-scalable=no, maximum-scale=1.0, initial-scale=1.0"
      />
    </NextHead>
  );
};
