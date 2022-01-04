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
      <div className="divide-y divide-zinc-800">
        <div className="flex justify-between items-center py-4">
          <h2 className="text-2xl">Origins</h2>
          <Link href={staticRoutes.newOrigin} passHref>
            <Button>Add origin</Button>
          </Link>
        </div>
        <div className="py-4 grid grid-cols-1 gap-2">
          {origins.length ? (
            origins.map(({ name, slug, last24hRequests }) => (
              <Link href={dynamicRoutes.origin({ slug })} passHref key={name}>
                <div
                  className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg cursor-pointer"
                  key={name}
                >
                  <div className="flex justify-between">
                    <h2 className="text-2xl">{name}</h2>
                    <OriginSettingsButton slug={slug} size={6} />
                  </div>
                  <p className="text-lg mt-2">{last24hRequests} requests in last 24h</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-xl">No origins available.</p>
          )}
        </div>
      </div>
    </MainTemplate>
  );
};

export default withAuth(Origins);
