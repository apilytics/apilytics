import React from 'react';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';

import { BlogTemplate } from 'components/layout/BlogTemplate';
import { withUser } from 'hocs/withUser';
import { BLOGS_PATH, getDocsData, getFilePaths, getMDXContent } from 'utils/mdx';
import type { BlogPageProps } from 'types';

const Blog: NextPage<BlogPageProps> = (props) => <BlogTemplate {...props} />;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { source, data } = await getMDXContent(`src/blogs/${params?.slug}.mdx`);
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
  const paths = getFilePaths(BLOGS_PATH)
    .map((path) => path.replace(/\.mdx?$/, ''))
    .map((slug) => ({
      params: { slug },
    }));

  return {
    paths,
    fallback: false,
  };
};

export default withUser(Blog);
