import React from 'react';
import type { NextPage } from 'next';

import { NotFoundTemplate } from 'components/layout/NotFoundTemplate';
import { useContext } from 'hooks/useContext';
import { useFetch } from 'hooks/useFetch';
import { dynamicApiRoutes } from 'utils/router';
import type { OriginData } from 'types';

export const withOrigin = <T extends Record<string, unknown>>(
  PageComponent: NextPage<T>,
): NextPage<T> => {
  const WithOrigin: NextPage<T> = (pageProps: T) => {
    const { slug, setOrigin } = useContext();
    const url = slug ? dynamicApiRoutes.origin({ slug }) : undefined;

    const { notFound } = useFetch<OriginData>({
      url,
      successCallback: ({ data }) => setOrigin(data),
    });

    if (notFound) {
      return <NotFoundTemplate />;
    }

    return <PageComponent {...pageProps} />;
  };

  return WithOrigin;
};
