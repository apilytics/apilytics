import React from 'react';
import type { NextPage } from 'next';

import { MainTemplate } from 'components/layout/MainTemplate';
import { AccountForm } from 'components/shared/AccountForm';
import { withAuth } from 'hocs/withAuth';

const Account: NextPage = () => (
  <MainTemplate>
    <h2 className="text-2xl">Account settings</h2>
    <AccountForm />
  </MainTemplate>
);

export default withAuth(Account);
