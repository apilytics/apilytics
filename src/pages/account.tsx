import React from 'react';
import type { NextPage } from 'next';

import { Layout } from 'components/layout/Layout';
import { AccountForm } from 'components/shared/AccountForm';
import { withAuth } from 'hocs/withAuth';

const Account: NextPage = () => (
  <Layout noIndex headerMaxWidth="3xl">
    <div className="bg-background bg-no-repeat bg-cover flex grow">
      <div className="bg-filter grow">
        <div className={`container max-w-3xl py-16 animate-fade-in-top animation-delay-400`}>
          <h2 className="text-2xl text-secondary">Account settings</h2>
          <AccountForm />
        </div>
      </div>
    </div>
  </Layout>
);

export default withAuth(Account);
