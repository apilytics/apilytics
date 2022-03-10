import React from 'react';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';

import { MainTemplate } from 'components/layout/MainTemplate';
import { CTASection } from 'components/shared/CTASection';
import { MDX } from 'components/shared/MDX';
import { withUser } from 'hocs/withUser';
import {
  CONTENT_PATH,
  getFilePaths,
  getMDXContent,
  validateMandatoryFrontMatterKeys,
} from 'utils/mdx';
import type { MDXPageProps } from 'types';

interface Props extends MDXPageProps {
  data: {
    title: string;
    description: string;
    indexable: boolean;
  };
}

const ContentPage: NextPage<Props> = ({ source, data }) => (
  <MainTemplate headProps={data}>
    <div className="card rounded-lg bg-base-100 p-4 text-white shadow">
      <MDX source={source} />
    </div>
    <CTASection />
  </MainTemplate>
);

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const path = `src/content/${params?.slug}.mdx`;
  const { source, data } = await getMDXContent(path);
  const properties = ['title', 'description', 'indexable'];
  validateMandatoryFrontMatterKeys(data, properties, path);

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

export default withUser(ContentPage);
