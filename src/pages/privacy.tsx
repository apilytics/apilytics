import { readFileSync } from 'fs';
import { join } from 'path';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { GetStaticProps, NextPage } from 'next';

import { Layout } from 'components/layout/Layout';

interface Props {
  content: string;
}

const Privacy: NextPage<Props> = ({ content }) => (
  <Layout noIndex headerMaxWidth="3xl">
    <div className="bg-background bg-no-repeat bg-cover">
      <div className="bg-filter">
        <div className="container max-w-3xl mx-auto py-16">
          <ReactMarkdown className="text-left text-white">{content}</ReactMarkdown>
        </div>
      </div>
    </div>
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
