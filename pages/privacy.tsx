import { Layout } from 'components';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { readFileSync } from 'fs';
import { join } from 'path';
import ReactMarkdown from 'react-markdown';

interface Props {
  content: string;
}

const Privacy: NextPage<Props> = ({ content }) => (
  <Layout dense noIndex>
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
