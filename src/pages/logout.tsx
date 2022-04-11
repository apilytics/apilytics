import { signOut } from 'next-auth/react';
import React, { useEffect } from 'react';
import type { NextPage } from 'next';

import { MainTemplate } from 'components/layout/MainTemplate';
import { Button } from 'components/shared/Button';
import { useContext } from 'hooks/useContext';
import { usePlausible } from 'hooks/usePlausible';
import { staticRoutes } from 'utils/router';

const Logout: NextPage = () => {
  const { user } = useContext();
  const plausible = usePlausible();

  useEffect(() => {
    if (user) {
      plausible('logout');
      signOut({ callbackUrl: staticRoutes.logout });
    }
  }, [plausible, user]);

  return (
    <MainTemplate headProps={{ title: 'Logout' }}>
      <h4 className="text-center text-white">You have been logged out.</h4>
      <div className="mx-auto mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Button linkTo={staticRoutes.root} className="btn-primary" fullWidth="mobile">
          Continue
        </Button>
        <Button
          linkTo={staticRoutes.login}
          className="btn-outline btn-secondary"
          fullWidth="mobile"
        >
          Log in again
        </Button>
      </div>
    </MainTemplate>
  );
};

export default Logout;
