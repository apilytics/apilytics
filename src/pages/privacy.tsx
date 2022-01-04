import { readFileSync } from 'fs';
import { join } from 'path';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { GetStaticProps, NextPage } from 'next';

import { MainTemplate } from 'components/layout/MainTemplate';

interface Props {
  content: string;
}

const Privacy: NextPage<Props> = ({ content }) => (
  <MainTemplate>
    <ReactMarkdown className="text-left">{content}</ReactMarkdown>
  </MainTemplate>
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
