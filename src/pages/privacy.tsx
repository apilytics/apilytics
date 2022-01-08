import { readFileSync } from 'fs';
import { join } from 'path';

import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import React from 'react';
import type { GetStaticProps, NextPage } from 'next';

import { MainTemplate } from 'components/layout/MainTemplate';
import type { MDXPageProps } from 'types';

const Privacy: NextPage<MDXPageProps> = ({ source }) => (
  <MainTemplate>
    <div className="card rounded-lg shadow-2xl p-4 bg-base-100">
      <MDXRemote {...source} />
    </div>
  </MainTemplate>
);

export const getStaticProps: GetStaticProps = async () => {
  const fullPath = join(process.cwd(), 'src/privacy.mdx');
  const source = readFileSync(fullPath);
  const { content } = matter(source);
  const mdxSource = await serialize(content);

  return {
    props: {
      source: mdxSource,
    },
  };
};

export default Privacy;
