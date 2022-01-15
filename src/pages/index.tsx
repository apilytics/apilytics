import { readdirSync } from 'fs';
import { join } from 'path';

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
import { getMDXContent } from 'utils/mdx';
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
  const path = 'snippets';
  const fullPath = join(process.cwd(), path);
  const files = readdirSync(fullPath).filter((path) => /\.mdx?$/.test(path));

  // @ts-ignore: The front matter types are inferred as `any`;
  const _snippets: Snippet[] = await Promise.all(
    files.map(async (file) => {
      const {
        source,
        data: { name, order },
      } = await getMDXContent(`${path}/${file}`);

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
