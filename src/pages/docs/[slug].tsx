import { readFileSync } from 'fs';
import { join } from 'path';

import matter from 'gray-matter';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import React from 'react';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import type { ReactNode } from 'react';

import { DocsTemplate } from 'components/layout/DocsTemplate';
import { Button } from 'components/shared/Button';
import { FRONTEND_DOMAIN } from 'utils/constants';
import { DOCS_FILE_PATHS, DOCS_INFO, DOCS_PATH } from 'utils/mdx';
import { staticRoutes } from 'utils/router';
import type { MDXPageProps } from 'types';

const components: Record<string, ReactNode> = {
  LoginLink: () => (
    <Link href={staticRoutes.login}>{`${FRONTEND_DOMAIN}${staticRoutes.login}`}</Link>
  ),
  SignupButton: () => (
    <Link href={staticRoutes.login} passHref>
      <Button className="btn-primary btn-outline">Sign up here</Button>
    </Link>
  ),
  BYOMLink: ({ text }: { text: string }) => <Link href={staticRoutes.byom}>{text}</Link>,
  GHLink: ({ middleware, name }: { middleware: string; name: string }) => (
    <a href={`https://github.com/apilytics/${middleware}`} target="__blank" rel="noreferrer">
      {name}
    </a>
  ),
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
  const paths = DOCS_FILE_PATHS.map((path) => path.replace(/\.mdx?$/, '')).map((slug) => ({
    params: { slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export default Docs;
