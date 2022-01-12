import React from 'react';
import type { NextPage } from 'next';

import { BottomSection } from 'components/Home/BottomSection';
import { Features } from 'components/Home/Features';
import { Pricing } from 'components/Home/Pricing';
import { Setup } from 'components/Home/Setup';
import { TopSection } from 'components/Home/TopSection';
import { Why } from 'components/Home/Why';
import { Layout } from 'components/layout/Layout';
import { withNoAuth } from 'hocs/withNoAuth';

const Home: NextPage = () => (
  <Layout>
    <TopSection />
    <Features />
    <Setup />
    <Pricing />
    <Why />
    <BottomSection />
  </Layout>
);

export default withNoAuth(Home);
