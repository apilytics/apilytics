import { readFileSync } from 'fs';
import { join } from 'path';

import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import React from 'react';
import type { GetStaticProps, NextPage } from 'next';

import { DocsTemplate } from 'components/layout/DocsTemplate';
import { DOCS_INFO, DOCS_PATH } from 'utils/mdx';
import type { MDXPageProps } from 'types';

const Docs: NextPage<MDXPageProps> = ({ source, frontMatter, docsInfo }) => (
  <DocsTemplate {...frontMatter} docsInfo={docsInfo}>
    <MDXRemote {...source} />
  </DocsTemplate>
);

export const getStaticProps: GetStaticProps = async () => {
  const fullPath = join(DOCS_PATH, 'index.mdx');
  const source = readFileSync(fullPath);
  const { content, data: frontMatter } = matter(source);
  const mdxSource = await serialize(content);

  return {
    props: {
      source: mdxSource,
      frontMatter,
      docsInfo: DOCS_INFO,
    },
  };
};

export default Docs;
