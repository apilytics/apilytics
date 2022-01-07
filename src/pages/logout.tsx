import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { usePlausible } from 'next-plausible';
import React, { useEffect } from 'react';
import type { NextPage } from 'next';

import { LoadingTemplate } from 'components/layout/LoadingTemplate';
import { MainTemplate } from 'components/layout/MainTemplate';
import { Button } from 'components/shared/Button';
import { useAccount } from 'hooks/useAccount';
import { staticRoutes } from 'utils/router';
import type { PlausibleEvents } from 'types';

const Logout: NextPage = () => {
  const { user } = useAccount();
  const plausible = usePlausible<PlausibleEvents>();

  useEffect(() => {
    if (user) {
      plausible('logout');
      signOut({ callbackUrl: staticRoutes.logout });
    }
  }, [plausible, user]);

  if (user) {
    return <LoadingTemplate />;
  }

  return (
    <MainTemplate>
      <h1 className="text-3xl mt-4 text-center">You have been logged out.</h1>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:inline-grid mt-8 mx-auto">
        <Link href={staticRoutes.root} passHref>
          <Button className="btn-primary">Continue</Button>
        </Link>
        <Link href={staticRoutes.login} passHref>
          <Button className="btn-secondary btn-outline">Log in again</Button>
        </Link>
      </div>
    </MainTemplate>
  );
};

export default Logout;
