import React from 'react';
import type { NextPage } from 'next';

import { Features } from 'components/Home/Features';
import { Pricing } from 'components/Home/Pricing';
import { Setup } from 'components/Home/Setup';
import { TopSection } from 'components/Home/TopSection';
import { Layout } from 'components/layout/Layout';

const Home: NextPage = () => (
  <Layout>
    <TopSection />
    <Features />
    <Setup />
    <Pricing />
  </Layout>
);

export default Home;
