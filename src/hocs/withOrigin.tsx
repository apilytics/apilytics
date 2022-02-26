import React, { useEffect } from 'react';
import type { NextPage } from 'next';

import { NotFoundTemplate } from 'components/layout/NotFoundTemplate';
import { useOrigin } from 'hooks/useOrigin';
import { useUIState } from 'hooks/useUIState';
import { UNEXPECTED_ERROR } from 'utils/constants';
import { dynamicApiRoutes } from 'utils/router';

export const withOrigin = <T extends Record<string, unknown>>(
  PageComponent: NextPage<T>,
): NextPage<T> => {
  const WithOrigin: NextPage<T> = (pageProps: T) => {
    const { slug, setOrigin } = useOrigin();
    const { setLoading, setErrorMessage, notFound, setNotFound } = useUIState();

    useEffect(() => {
      if (slug) {
        (async (): Promise<void> => {
          setLoading(true);

          try {
            const res = await fetch(dynamicApiRoutes.origin({ slug }));

            if (res.status === 200) {
              const { data } = await res.json();
              setOrigin(data);
            } else {
              setNotFound(true);
            }
          } catch {
            setErrorMessage(UNEXPECTED_ERROR);
          } finally {
            setLoading(false);
          }
        })();
      }
    }, [setErrorMessage, setLoading, setNotFound, setOrigin, slug]);

    if (notFound) {
      return <NotFoundTemplate />;
    }

    return <PageComponent {...pageProps} />;
  };

  return WithOrigin;
};
