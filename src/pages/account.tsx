import React from 'react';
import type { NextPage } from 'next';

import { MainTemplate } from 'components/layout/MainTemplate';
import { AccountForm } from 'components/shared/AccountForm';
import { withAuth } from 'hocs/withAuth';

const Account: NextPage = () => (
  <MainTemplate>
    <AccountForm title="Account settings" />
  </MainTemplate>
);

export default withAuth(Account);
