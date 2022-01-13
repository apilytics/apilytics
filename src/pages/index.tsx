import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

import matter from 'gray-matter';
import React from 'react';
import type { GetStaticProps, NextPage } from 'next';

import { BottomSection } from 'components/Home/BottomSection';
import { Features } from 'components/Home/Features';
import { Pricing } from 'components/Home/Pricing';
import { Setup } from 'components/Home/Setup';
import { TopSection } from 'components/Home/TopSection';
import { Why } from 'components/Home/Why';
import { Layout } from 'components/layout/Layout';
import { withNoAuth } from 'hocs/withNoAuth';
import { getSerializedSource } from 'utils/mdx';
import type { Snippet } from 'types';

interface Props extends Record<string, unknown> {
  snippets: Snippet[];
}

const Home: NextPage<Props> = ({ snippets }) => (
  <Layout>
    <TopSection />
    <Features />
    <Setup snippets={snippets} />
    <Pricing />
    <Why />
    <BottomSection />
  </Layout>
);

export const getStaticProps: GetStaticProps = async () => {
  const snippetsPath = join(process.cwd(), 'src/snippets');
  const files = readdirSync(snippetsPath).filter((path) => /\.mdx?$/.test(path));

  const snippets = await Promise.all(
    files.map(async (file) => {
      const fullPath = join(snippetsPath, file);
      const source = readFileSync(fullPath);

      const {
        content,
        data: { name, order },
      } = matter(source);

      const mdxSource = await getSerializedSource(content);

      return {
        name,
        order,
        source: mdxSource,
      };
    }),
  );

  return {
    props: {
      snippets: snippets.sort((a, b) => a.order - b.order),
    },
  };
};

export default withNoAuth(Home);
