import { readFileSync } from 'fs';
import { join } from 'path';

import matter from 'gray-matter';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import React from 'react';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';

import { DocsTemplate } from 'components/layout/DocsTemplate';
import { Button } from 'components/shared/Button';
import { ExternalLink } from 'components/shared/ExternalLink';
import { withAccount } from 'hocs/withAccount';
import { DOCS_INFO, DOCS_PATH, getDocsFilePaths } from 'utils/mdx';
import type { MDXPageProps } from 'types';

const components = {
  Link,
  Button,
  ExternalLink,
};

const Docs: NextPage<MDXPageProps> = ({ source, frontMatter, docsInfo }) => (
  <DocsTemplate {...frontMatter} docsInfo={docsInfo}>
    <MDXRemote {...source} components={components} />
  </DocsTemplate>
);

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const fullPath = join(DOCS_PATH, `${params?.slug}.mdx`);
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

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getDocsFilePaths()
    .map((path) => path.replace(/\.mdx?$/, ''))
    .map((slug) => ({
      params: { slug },
    }));

  return {
    paths,
    fallback: false,
  };
};

export default withAccount(Docs);
