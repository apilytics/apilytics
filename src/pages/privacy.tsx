import { MDXRemote } from 'next-mdx-remote';
import React from 'react';
import type { GetStaticProps, NextPage } from 'next';

import { MainTemplate } from 'components/layout/MainTemplate';
import { withAccount } from 'hocs/withAccount';
import { getMDXContent } from 'utils/mdx';
import type { MDXPageProps } from 'types';

const Privacy: NextPage<MDXPageProps> = ({ source }) => (
  <MainTemplate>
    <div className="card rounded-lg shadow p-4 bg-base-100 text-white">
      <MDXRemote {...source} />
    </div>
  </MainTemplate>
);

export const getStaticProps: GetStaticProps = async () => {
  const { source } = await getMDXContent('privacy.mdx');

  return {
    props: {
      source,
    },
  };
};

export default withAccount(Privacy);
