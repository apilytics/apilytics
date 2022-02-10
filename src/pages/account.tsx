import React from 'react';
import type { NextPage } from 'next';

import { MainTemplate } from 'components/layout/MainTemplate';
import { AccountForm } from 'components/shared/AccountForm';
import { BackButton } from 'components/shared/BackButton';
import { withAuth } from 'hocs/withAuth';
import { staticRoutes } from 'utils/router';

const Account: NextPage = () => (
  <MainTemplate headProps={{ title: 'Account' }}>
    <div className="card rounded-lg bg-base-100 p-4 shadow">
      <BackButton linkTo={staticRoutes.origins} text="Origins" />
      <AccountForm title="Account settings" />
    </div>
  </MainTemplate>
);

export default withAuth(Account);
