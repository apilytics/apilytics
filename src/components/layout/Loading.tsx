import React from 'react';

import { Layout } from 'components/layout/Layout';

export const Loading: React.FC = () => (
  <Layout noIndex headerMaxWidth="3xl">
    <div className="bg-background bg-no-repeat bg-cover flex grow">
      <div className="bg-filter grow flex">
        <div className="container max-w-3xl mx-auto py-16 flex items-center justify-center">
          <h1 className="text-2xl text-primary">Loading...</h1>
        </div>
      </div>
    </div>
  </Layout>
);
