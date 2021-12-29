import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { usePlausible } from 'next-plausible';
import React, { useEffect } from 'react';
import type { NextPage } from 'next';

import { Layout } from 'components/layout/Layout';
import { Loading } from 'components/layout/Loading';
import { Button } from 'components/shared/Button';
import { routes } from 'utils/router';
import type { PlausibleEvents } from 'types';

const Logout: NextPage = () => {
  const { user } = useSession().data || {};
  const plausible = usePlausible<PlausibleEvents>();

  useEffect(() => {
    if (user) {
      plausible('logout');
      signOut({ callbackUrl: routes.logout });
    }
  }, [plausible, user]);

  if (user) {
    return <Loading />;
  }

  return (
    <Layout noIndex headerMaxWidth="3xl" hideLogin>
      <div className="bg-background bg-no-repeat bg-cover flex grow">
        <div className="bg-filter grow">
          <div className="container max-w-3xl mx-auto py-16 animate-fade-in-top animation-delay-400 text-center">
            <h1 className="text-white text-3xl mt-4">You have been logged out.</h1>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:inline-grid mt-8">
              <Link href={routes.root} passHref>
                <Button>Continue</Button>
              </Link>
              <Link href={routes.login} passHref>
                <Button variant="secondary">Log in again</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Logout;
