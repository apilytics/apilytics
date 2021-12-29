import { useSession } from 'next-auth/react';
import React from 'react';
import type { NextPage } from 'next';

import { DashboardContent } from 'components/Dashboard/DashboardContent';
import { Layout } from 'components/layout/Layout';
import { withAuth } from 'hocs/withAuth';

const Dashboard: NextPage = () => {
  const { name } = useSession().data?.user || {};
  const headerContent = !!name && <p>{name}</p>;
  const maxWidth = name ? '5xl' : '3xl';

  return (
    <Layout noIndex headerMaxWidth={maxWidth} headerContent={headerContent}>
      <div className="bg-background bg-no-repeat bg-cover flex grow">
        <div className="bg-filter grow">
          <div
            className={`container max-w-${maxWidth} py-16 animate-fade-in-top animation-delay-400`}
          >
            <DashboardContent />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(Dashboard);
