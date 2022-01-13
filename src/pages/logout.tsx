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
      <h4 className="text-center">You have been logged out.</h4>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-8 mx-auto">
        <Button linkTo={staticRoutes.root} className="btn-primary" fullWidth="mobile">
          Continue
        </Button>
        <Button
          linkTo={staticRoutes.login}
          className="btn-secondary btn-outline"
          fullWidth="mobile"
        >
          Log in again
        </Button>
      </div>
    </MainTemplate>
  );
};

export default Logout;
