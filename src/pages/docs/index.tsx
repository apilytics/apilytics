import React from 'react';
import type { GetStaticProps, NextPage } from 'next';

import { DocsTemplate } from 'components/layout/DocsTemplate';
import { withUser } from 'hocs/withUser';
import { getDocsData, getMDXContent } from 'utils/mdx';
import type { DocsPageProps } from 'types';

const Docs: NextPage<DocsPageProps> = (props) => <DocsTemplate {...props} />;

export const getStaticProps: GetStaticProps = async () => {
  const { source, data } = await getMDXContent('src/docs/index.mdx');
  const docsData = getDocsData();

  return {
    props: {
      source,
      data,
      docsData,
    },
  };
};

export default withUser(Docs);
