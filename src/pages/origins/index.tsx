import { CogIcon, PlusIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import Router from 'next/router';
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
          <h4 className="text-white">Origins</h4>
          <Button linkTo={staticRoutes.newOrigin} endIcon={PlusIcon} className="btn-primary">
            Add origin
          </Button>
        </div>
        <div className="py-4 grid grid-cols-1 gap-2">
          {origins.length ? (
            origins.map(({ name, slug, last24hRequests }) => (
              <Link href={dynamicRoutes.origin({ slug })} key={name}>
                <a className="unstyled">
                  <div className="bg-base-100 hover:bg-gray-700 card rounded-lg p-2" key={name}>
                    <div className="flex justify-between">
                      <h5>{name}</h5>
                      <IconButton
                        icon={CogIcon}
                        tooltip="Go to origin settings."
                        onClick={(): Promise<boolean> =>
                          Router.push(dynamicRoutes.originSettings({ slug }))
                        }
                      />
                    </div>
                    <p>{last24hRequests} requests in last 24h</p>
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
