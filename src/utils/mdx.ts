import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeHighlight from 'rehype-highlight';
import remarkHeadingId from 'remark-heading-id';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

import type { DocsFrontMatter } from 'types';

export const getFullPath = (path: string): string => join(process.cwd(), path);

interface MDXContent {
  source: MDXRemoteSerializeResult;
  data: Record<string, unknown>;
}

export const getMDXContent = async (path: string): Promise<MDXContent> => {
  const fullPath = getFullPath(path);
  const _source = readFileSync(fullPath);
  const { content, data } = matter(_source);

  const source = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [rehypeHighlight],
      remarkPlugins: [remarkHeadingId],
    },
  });

  return { source, data };
};

const filterMDXFiles = (path: string): boolean => /\.mdx?$/.test(path);
export const getFilePaths = (path: string): string[] => readdirSync(path).filter(filterMDXFiles);

export const DOCS_PATH = getFullPath('src/docs');
export const BLOGS_PATH = getFullPath('src/blogs');
export const CONTENT_PATH = getFullPath('src/content');

const validateMandatoryFrontMatterKeys = (
  data: Record<string, unknown>,
  properties: string[],
  path: string,
): void => {
  properties.forEach((prop) => {
    if (!data[prop]) {
      throw new Error(`Missing front matter property '${prop}' for ${path}!`);
    }
  });
};

export const getDocsData = (): Record<string, unknown>[] =>
  getFilePaths(DOCS_PATH)
    .map((path) => {
      const fullPath = join(DOCS_PATH, path);
      const source = readFileSync(fullPath);
      const { data } = matter(source);
      const properties = ['name', 'order'];
      validateMandatoryFrontMatterKeys(data, properties, path);

      return {
        ...(data as DocsFrontMatter),
        path,
      };
    })
    .map((doc) => ({
      ...doc,
      path: doc.path.replace(/\.mdx?$/, ''),
    }))
    .sort((a, b) => a.order - b.order);

export const getBlogsData = (): Record<string, unknown>[] =>
  getFilePaths(BLOGS_PATH).map((path) => {
    const fullPath = join(BLOGS_PATH, path);
    const source = readFileSync(fullPath);
    const { data } = matter(source);
    const properties = ['title', 'slug', 'author', 'authorImage', 'excerpt'];
    validateMandatoryFrontMatterKeys(data, properties, path);
    return data;
  });
