import { readFileSync } from 'fs';
import { join } from 'path';

import { Layout } from 'components';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { GetStaticProps, NextPage } from 'next';

interface Props {
  content: string;
}

const Privacy: NextPage<Props> = ({ content }) => (
  <Layout noIndex>
    <ReactMarkdown>{content}</ReactMarkdown>
  </Layout>
);

export const getStaticProps: GetStaticProps = async () => {
  const fullPath = join(process.cwd(), 'privacy.md');
  const content = readFileSync(fullPath, 'utf8');

  return {
    props: {
      content,
    },
  };
};

export default Privacy;
