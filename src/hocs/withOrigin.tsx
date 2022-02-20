import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';

import { ErrorTemplate } from 'components/layout/ErrorTemplate';
import { NotFoundTemplate } from 'components/layout/NotFoundTemplate';
import { useOrigin } from 'hooks/useOrigin';
import { dynamicApiRoutes } from 'utils/router';

export const withOrigin = <T extends Record<string, unknown>>(
  PageComponent: NextPage<T>,
): NextPage<T> => {
  const WithOrigin: NextPage<T> = (pageProps: T) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { slug, origin, setOrigin } = useOrigin();

    useEffect(() => {
      (async (): Promise<void> => {
        try {
          const res = await fetch(dynamicApiRoutes.origin({ slug }));

          if (res.status === 200) {
            const { data } = await res.json();
            setOrigin(data);
          }
        } catch {
          setError(true);
        } finally {
          setLoading(false);
        }
      })();
    }, [setOrigin, slug]);

    if (error) {
      return <ErrorTemplate />;
    }

    if (!origin && !loading) {
      return <NotFoundTemplate />;
    }

    return <PageComponent {...pageProps} />;
  };

  return WithOrigin;
};
