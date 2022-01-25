import React from 'react';
import type { NextPage } from 'next';

import { MainTemplate } from 'components/layout/MainTemplate';
import { AccountForm } from 'components/shared/AccountForm';
import { BackButton } from 'components/shared/BackButton';
import { withAuth } from 'hocs/withAuth';
import { staticRoutes } from 'utils/router';

const title = 'Account settings';

const Account: NextPage = () => (
  <MainTemplate title={title}>
    <div className="card rounded-lg p-4 shadow bg-base-100">
      <BackButton linkTo={staticRoutes.origins} text="Origins" />
      <AccountForm title={title} />
    </div>
  </MainTemplate>
);

export default withAuth(Account);
