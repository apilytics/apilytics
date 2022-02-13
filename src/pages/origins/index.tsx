import { PlusIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';

import { ErrorTemplate } from 'components/layout/ErrorTemplate';
import { MainTemplate } from 'components/layout/MainTemplate';
import { Button } from 'components/shared/Button';
import { OriginMenu } from 'components/shared/OriginMenu';
import { withAuth } from 'hocs/withAuth';
import { useAccount } from 'hooks/useAccount';
import { dynamicRoutes, staticApiRoutes, staticRoutes } from 'utils/router';

const Origins: NextPage = () => {
  const { origins, setOrigins } = useAccount();
  const [error, setError] = useState(false);

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const res = await fetch(staticApiRoutes.origins);

        if (res.status === 200) {
          const { data } = await res.json();
          setOrigins(data);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      }
    })();
  }, [setOrigins]);

  if (error) {
    return <ErrorTemplate />;
  }

  return (
    <MainTemplate headProps={{ title: 'Origins' }}>
      <div className="divide-y divide-base-content">
        <div className="flex flex-col pb-4 sm:flex-row sm:items-center sm:justify-between">
          <h5 className="text-white">Origins</h5>
          <Button
            linkTo={staticRoutes.newOrigin}
            endIcon={PlusIcon}
            className="btn-outline btn-primary"
          >
            Add origin
          </Button>
        </div>
        <div className="flex flex-col gap-2 py-4">
          {origins.length ? (
            origins.map(({ name, slug }) => (
              <Link href={dynamicRoutes.origin({ slug })} key={name}>
                <a className="unstyled">
                  <div
                    className="card rounded-lg bg-base-100 px-4 py-2 hover:bg-gray-700"
                    key={name}
                  >
                    <div className="flex items-center justify-between">
                      <h6>{name}</h6>
                      <OriginMenu slug={slug} />
                    </div>
                  </div>
                </a>
              </Link>
            ))
          ) : (
            <p>No origins available. Add your first origin to start analyzing your APIs.</p>
          )}
        </div>
      </div>
    </MainTemplate>
  );
};

export default withAuth(Origins);
