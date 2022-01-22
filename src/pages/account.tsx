import React from 'react';
import type { NextPage } from 'next';

import { MainTemplate } from 'components/layout/MainTemplate';
import { AccountForm } from 'components/shared/AccountForm';
import { withAuth } from 'hocs/withAuth';

const title = 'Account settings';

const Account: NextPage = () => (
  <MainTemplate title={title}>
    <AccountForm title={title} />
  </MainTemplate>
);

export default withAuth(Account);
