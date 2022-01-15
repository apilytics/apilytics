import React from 'react';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';

import { withAccount } from 'hocs/withAccount';
import { getBlogFilePaths, getDocsData, getMDXContent } from 'utils/mdx';
import type { BlogPageProps } from 'types';
import { BlogTemplate } from 'components/layout/BlogTemplate';

const Blog: NextPage<BlogPageProps> = (props) => <BlogTemplate {...props} />;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { source, data } = await getMDXContent(`blogs/${params?.slug}.mdx`);
  const blogsData = getDocsData();

  return {
    props: {
      source,
      data,
      blogsData,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getBlogFilePaths()
    .map((path) => path.replace(/\.mdx?$/, ''))
    .map((slug) => ({
      params: { slug },
    }));

  return {
    paths,
    fallback: false,
  };
};

export default withAccount(Blog);
