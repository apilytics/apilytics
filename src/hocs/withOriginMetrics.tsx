import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';

import { LoadingTemplate } from 'components/layout/LoadingTemplate';
import { useOrigin } from 'hooks/useOrigin';
import { dynamicApiRoutes } from 'utils/router';

export const withOriginMetrics = <T extends Record<string, unknown>>(
  PageComponent: NextPage<T>,
): NextPage<T> => {
  const WithOriginMetrics: NextPage<T> = (pageProps: T) => {
    const { query } = useRouter();
    const slug = query.slug;
    const [loading, setLoading] = useState(false);
    const { setOrigin, setMetrics } = useOrigin();

    useEffect(() => {
      if (typeof slug === 'string') {
        (async (): Promise<void> => {
          setLoading(true);

          const [originRes, metricsRes] = await Promise.all([
            fetch(dynamicApiRoutes.origin({ slug })),
            fetch(dynamicApiRoutes.originMetrics({ slug })),
          ]);

          const { data: originData } = await originRes.json();
          const { data: metricsData } = await metricsRes.json();
          setOrigin(originData);
          setMetrics(metricsData);
          setLoading(false);
        })();
      }
    }, [setMetrics, setOrigin, slug]);

    if (loading) {
      return <LoadingTemplate />;
    }

    return <PageComponent {...pageProps} />;
  };

  return WithOriginMetrics;
};
