import React from 'react';
import type { NextPage } from 'next';

import { Features, Layout, Pricing, Setup, TopSection } from 'components';

const Home: NextPage = () => (
  <Layout>
    <TopSection />
    <Features />
    <Setup />
    <Pricing />
  </Layout>
);

export default Home;
