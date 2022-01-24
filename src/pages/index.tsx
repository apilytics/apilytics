import { readdirSync } from 'fs';

import React from 'react';
import type { GetStaticProps, NextPage } from 'next';

import { Features } from 'components/Home/Features';
import { Pricing } from 'components/Home/Pricing';
import { Setup } from 'components/Home/Setup';
import { TopSection } from 'components/Home/TopSection';
import { Why } from 'components/Home/Why';
import { Layout } from 'components/layout/Layout';
import { CTASection } from 'components/shared/CTASection';
import { withNoAuth } from 'hocs/withNoAuth';
import { DEFAULT_SEO_DESCRIPTION } from 'utils/constants';
import { getFullPath, getMDXContent } from 'utils/mdx';
import type { Snippet } from 'types';

interface Props extends Record<string, unknown> {
  snippets: Snippet[];
}

const Home: NextPage<Props> = ({ snippets }) => (
  <Layout
    title="API analytics made easy"
    description={DEFAULT_SEO_DESCRIPTION}
    indexable
    maxWidth="max-w-8xl"
  >
    <TopSection />
    <Features />
    <Setup snippets={snippets} />
    <Pricing />
    <Why />
    <CTASection />
  </Layout>
);

export const getStaticProps: GetStaticProps = async () => {
  const path = getFullPath('src/snippets');
  const files = readdirSync(path).filter((path) => /\.mdx?$/.test(path));

  // @ts-ignore: The front matter types are inferred as `any`;
  const _snippets: Snippet[] = await Promise.all(
    files.map(async (file) => {
      const {
        source,
        data: { name, order },
      } = await getMDXContent(`src/snippets/${file}`);

      return {
        name,
        order,
        source,
      };
    }),
  );

  const snippets = _snippets.sort((a, b) => a.order - b.order);

  return {
    props: {
      snippets,
    },
  };
};

export default withNoAuth(Home);
