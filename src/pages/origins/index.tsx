import { PlusIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import React from 'react';
import type { NextPage } from 'next';

import { MainTemplate } from 'components/layout/MainTemplate';
import { Button } from 'components/shared/Button';
import { OriginSettingsButton } from 'components/shared/OriginSettingsButton';
import { withAuth } from 'hocs/withAuth';
import { useAccount } from 'hooks/useAccount';
import { dynamicRoutes, staticRoutes } from 'utils/router';

const Origins: NextPage = () => {
  const { origins } = useAccount();

  return (
    <MainTemplate>
      <div className="divide-y">
        <div className="flex justify-between items-center py-4">
          <h2 className="text-2xl">Origins</h2>
          <Link href={staticRoutes.newOrigin} passHref>
            <Button className="btn-primary">
              Add origin <PlusIcon className="w-5 h-5 ml-2" />
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
                    <h2 className="text-2xl">{name}</h2>
                    <OriginSettingsButton slug={slug} small />
                  </div>
                  <p className="text-lg mt-2">{last24hRequests} requests in last 24h</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-xl">
              No origins available. Add your first origin to start analyzing your APIs.
            </p>
          )}
        </div>
      </div>
    </MainTemplate>
  );
};

export default withAuth(Origins);
