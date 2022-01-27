import { PlusIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import React from 'react';
import type { NextPage } from 'next';

import { MainTemplate } from 'components/layout/MainTemplate';
import { Button } from 'components/shared/Button';
import { OriginMenu } from 'components/shared/OriginMenu';
import { withAuth } from 'hocs/withAuth';
import { withOrigins } from 'hocs/withOrigins';
import { useAccount } from 'hooks/useAccount';
import { dynamicRoutes, staticRoutes } from 'utils/router';

const Origins: NextPage = () => {
  const { origins } = useAccount();

  return (
    <MainTemplate headProps={{ title: 'Origins' }}>
      <div className="divide-y divide-base-content">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-4">
          <h5 className="text-white">Origins</h5>
          <Button
            linkTo={staticRoutes.newOrigin}
            endIcon={PlusIcon}
            className="btn-primary btn-outline"
          >
            Add origin
          </Button>
        </div>
        <div className="py-4 flex flex-col gap-2">
          {origins.length ? (
            origins.map(({ name, slug }) => (
              <Link href={dynamicRoutes.origin({ slug })} key={name}>
                <a className="unstyled">
                  <div className="bg-base-100 hover:bg-gray-700 card rounded-lg p-2" key={name}>
                    <div className="flex justify-between items-center">
                      <h5>{name}</h5>
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

export default withOrigins(withAuth(Origins));
