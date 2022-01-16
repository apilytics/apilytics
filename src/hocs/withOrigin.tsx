import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';

import { LoadingTemplate } from 'components/layout/LoadingTemplate';
import { NotFoundTemplate } from 'components/layout/NotFoundTemplate';
import { useOrigin } from 'hooks/useOrigin';
import { dynamicApiRoutes } from 'utils/router';

export const withOrigin = <T extends Record<string, unknown>>(
  PageComponent: NextPage<T>,
): NextPage<T> => {
  const WithOrigin: NextPage<T> = (pageProps: T) => {
    const { query } = useRouter();
    const slug = query.slug;
    const [loading, setLoading] = useState(true);
    const { origin, setOrigin } = useOrigin();

    useEffect(() => {
      if (typeof slug === 'string') {
        (async (): Promise<void> => {
          const res = await fetch(dynamicApiRoutes.origin({ slug }));
          const { data } = await res.json();
          setOrigin(data);
          setLoading(false);
        })();
      }
    }, [setOrigin, slug]);

    if (loading) {
      return <LoadingTemplate />;
    }

    if (!origin) {
      return <NotFoundTemplate />;
    }

    return <PageComponent {...pageProps} />;
  };

  return WithOrigin;
};
