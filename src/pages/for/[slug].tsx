import React from 'react';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';

import { Layout } from 'components/layout/Layout';
import { CTASection } from 'components/shared/CTASection';
import { MDX } from 'components/shared/MDX';
import { SetupSection } from 'components/shared/SetupSection';
import { TopSection } from 'components/shared/TopSection';
import { WhySection } from 'components/shared/WhySection';
import {
  FOR_PATH,
  getFilePaths,
  getMDXContent,
  getSnippets,
  validateMandatoryFrontMatterKeys,
} from 'utils/mdx';
import type { MDXPageProps, Snippet } from 'types';

interface Props extends MDXPageProps {
  data: {
    title: string;
    name: string;
    frameworks?: string;
    description: string;
    indexable: boolean;
    hideIntegrations?: boolean;
    hideMDXContent?: boolean;
  };
  snippets: Snippet[];
}

const ForPage: NextPage<Props> = ({ data, source, snippets }) => (
  <Layout headProps={data} headerProps={{ maxWidth: 'max-w-8xl' }}>
    <TopSection
      title={
        <>
          <span className="text-primary">{data.name}</span>
          <br />
          <span className="text-white">application</span>
          <br />
          <span className="text-secondary">monitoring</span>
        </>
      }
      description={data.description}
      hideIntegrations={data.hideIntegrations}
    />
    {!data.hideMDXContent && (
      <div className="container flex max-w-3xl flex-col py-4 lg:py-16">
        <MDX source={source} snippets={snippets} />
      </div>
    )}
    <SetupSection snippets={snippets} frameworks={data.frameworks} noBackground />
    <WhySection />
    <CTASection />
  </Layout>
);

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const path = `src/for/${params?.slug}.mdx`;
  const { source, data } = await getMDXContent(path);
  const properties = ['title', 'name', 'description', 'indexable'];
  validateMandatoryFrontMatterKeys(data, properties, path);
  const snippets = await getSnippets();

  return {
    props: {
      source,
      data,
      snippets,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getFilePaths(FOR_PATH)
    .map((path) => path.replace(/\.mdx?$/, ''))
    .map((slug) => ({
      params: { slug },
    }));

  return {
    paths,
    fallback: false,
  };
};

export default ForPage;
