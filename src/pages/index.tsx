import React from 'react';
import type { GetStaticProps, NextPage } from 'next';

import { Layout } from 'components/layout/Layout';
import { CTASection } from 'components/shared/CTASection';
import { FeaturesSection } from 'components/shared/FeaturesSection';
import { PricingSection } from 'components/shared/PricingSection';
import { SetupSection } from 'components/shared/SetupSection';
import { TopSection } from 'components/shared/TopSection';
import { WhySection } from 'components/shared/WhySection';
import { withNoAuth } from 'hocs/withNoAuth';
import { DEFAULT_SEO_DESCRIPTION, DESCRIPTION } from 'utils/constants';
import { getSnippets } from 'utils/mdx';
import type { Snippet } from 'types';

const renderTitle = (
  <>
    <span className="text-primary">API analytics</span>
    <br />
    made <span className="text-secondary">easy</span>
  </>
);

interface Props extends Record<string, unknown> {
  snippets: Snippet[];
}

const Home: NextPage<Props> = ({ snippets }) => (
  <Layout
    headProps={{
      title: 'API analytics made easy',
      description: DEFAULT_SEO_DESCRIPTION,
      indexable: true,
    }}
    headerProps={{ maxWidth: 'max-w-8xl' }}
  >
    <TopSection title={renderTitle} description={DESCRIPTION} />
    <FeaturesSection />
    <SetupSection snippets={snippets} />
    <PricingSection />
    <WhySection />
    <CTASection />
  </Layout>
);

export const getStaticProps: GetStaticProps = async () => {
  const snippets = await getSnippets();

  return {
    props: {
      snippets,
    },
  };
};

export default withNoAuth(Home);
