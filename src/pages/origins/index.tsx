import { CogIcon, PlusIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import React from 'react';
import type { NextPage } from 'next';

import { MainTemplate } from 'components/layout/MainTemplate';
import { Button } from 'components/shared/Button';
import { IconButton } from 'components/shared/IconButton';
import { withAuth } from 'hocs/withAuth';
import { useAccount } from 'hooks/useAccount';
import { dynamicRoutes, staticRoutes } from 'utils/router';

const Origins: NextPage = () => {
  const { origins } = useAccount();

  return (
    <MainTemplate>
      <div className="divide-y divide-base-content">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4">
          <h3>Origins</h3>
          <Link href={staticRoutes.newOrigin} passHref>
            <Button className="btn-primary" endIcon={PlusIcon}>
              Add origin
            </Button>
          </Link>
        </div>
        <div className="py-4 grid grid-cols-1 gap-2">
          {origins.length ? (
            origins.map(({ name, slug, last24hRequests }) => (
              <Link href={dynamicRoutes.origin({ slug })} passHref key={name}>
                <div
                  className="bg-base-100 hover:bg-gray-700 card rounded-lg p-2 cursor-pointer"
                  key={name}
                >
                  <div className="flex justify-between">
                    <h5>{name}</h5>
                    <Link href={dynamicRoutes.originSettings({ slug })} passHref>
                      <IconButton icon={CogIcon} />
                    </Link>
                  </div>
                  <p>{last24hRequests} requests in last 24h</p>
                </div>
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
