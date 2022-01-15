import React from 'react';
import type { GetStaticProps, NextPage } from 'next';

import { DocsTemplate } from 'components/layout/DocsTemplate';
import { withAccount } from 'hocs/withAccount';
import { getDocsData, getMDXContent } from 'utils/mdx';
import type { DocsPageProps } from 'types';

const Docs: NextPage<DocsPageProps> = (props) => <DocsTemplate {...props} />;

export const getStaticProps: GetStaticProps = async () => {
  const path = 'docs/index.mdx';
  const { source, data } = await getMDXContent(path);
  const docsData = getDocsData();

  return {
    props: {
      source,
      data,
      docsData,
    },
  };
};

export default withAccount(Docs);
