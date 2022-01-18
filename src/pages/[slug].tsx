import React from 'react';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';

import { MainTemplate } from 'components/layout/MainTemplate';
import { CTASection } from 'components/shared/CTASection';
import { MDX } from 'components/shared/MDX';
import { withAccount } from 'hocs/withAccount';
import { CONTENT_PATH, getFilePaths, getMDXContent } from 'utils/mdx';
import type { MDXPageProps } from 'types';

interface Props extends MDXPageProps {
  data: {
    index?: boolean;
  };
}

const Content: NextPage<Props> = ({ source, data: { index } }) => (
  <MainTemplate index={index}>
    <div className="card rounded-lg shadow p-4 bg-base-100 text-white">
      <MDX source={source} />
    </div>
    <CTASection />
  </MainTemplate>
);

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { source, data } = await getMDXContent(`src/content/${params?.slug}.mdx`);

  return {
    props: {
      source,
      data,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getFilePaths(CONTENT_PATH)
    .map((path) => path.replace(/\.mdx?$/, ''))
    .map((slug) => ({
      params: { slug },
    }));

  return {
    paths,
    fallback: false,
  };
};

export default withAccount(Content);
