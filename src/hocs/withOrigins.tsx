import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';

import { ErrorTemplate } from 'components/layout/ErrorTemplate';
import { LoadingTemplate } from 'components/layout/LoadingTemplate';
import { useAccount } from 'hooks/useAccount';
import { staticApiRoutes } from 'utils/router';

export const withOrigins = <T extends Record<string, unknown>>(
  PageComponent: NextPage<T>,
): NextPage<T> => {
  const WithOrigins: NextPage<T> = (pageProps: T) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const { setOrigins } = useAccount();

    useEffect(() => {
      (async (): Promise<void> => {
        setLoading(true);

        try {
          const res = await fetch(staticApiRoutes.origins);
          const { data } = await res.json();
          setOrigins(data);
        } catch {
          setError(true);
        } finally {
          setLoading(false);
        }
      })();
    }, [setOrigins]);

    if (loading) {
      return <LoadingTemplate />;
    }

    if (error) {
      return <ErrorTemplate />;
    }

    return <PageComponent {...pageProps} />;
  };

  return WithOrigins;
};
