import { readFileSync } from 'fs';
import { join } from 'path';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { GetStaticProps, NextPage } from 'next';

import { Layout } from 'components';

interface Props {
  content: string;
}

const Privacy: NextPage<Props> = ({ content }) => (
  <Layout noIndex>
    <ReactMarkdown className="text-left text-white">{content}</ReactMarkdown>
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
