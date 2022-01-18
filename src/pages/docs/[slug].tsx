import React from 'react';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';

import { DocsTemplate } from 'components/layout/DocsTemplate';
import { withAccount } from 'hocs/withAccount';
import { DOCS_PATH, getDocsData, getFilePaths, getMDXContent } from 'utils/mdx';
import type { DocsPageProps } from 'types';

const Docs: NextPage<DocsPageProps> = (props) => <DocsTemplate {...props} />;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { source, data } = await getMDXContent(`src/docs/${params?.slug}.mdx`);
  const docsData = getDocsData();

  return {
    props: {
      source,
      data,
      docsData,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getFilePaths(DOCS_PATH)
    .map((path) => path.replace(/\.mdx?$/, ''))
    .map((slug) => ({
      params: { slug },
    }));

  return {
    paths,
    fallback: false,
  };
};

export default withAccount(Docs);
