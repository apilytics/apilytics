import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeHighlight from 'rehype-highlight';
import remarkHeadingId from 'remark-heading-id';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

import { staticRoutes } from 'utils/router';

const getFullPath = (path: string): string => join(process.cwd(), path);

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

const DOCS_PATH = getFullPath('docs');

export const getDocsFilePaths = (): string[] => readdirSync(DOCS_PATH).filter(filterMDXFiles);

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

const validateDocsFrontMatter = (data: Record<string, unknown>, path: string): void => {
  const properties = ['name', 'routeName', 'order'];
  validateMandatoryFrontMatterKeys(data, properties, path);

  if (typeof data.routeName === 'string') {
    if (!Object.keys(staticRoutes).includes(data.routeName)) {
      throw Error(`Invalid route name '${data.routeName}' for ${path}!`);
    }
  }
};

export const getDocsData = (): Record<string, unknown>[] =>
  getDocsFilePaths()
    .map((path) => {
      const fullPath = join(DOCS_PATH, path);
      const source = readFileSync(fullPath);
      const { data } = matter(source);
      validateDocsFrontMatter(data, path);
      return data;
    })
    .sort((a, b) => a.order - b.order);

const BLOGS_PATH = getFullPath('blogs');

export const getBlogFilePaths = (): string[] => readdirSync(BLOGS_PATH).filter(filterMDXFiles);

export const getBlogsData = (): Record<string, unknown>[] =>
  getBlogFilePaths().map((path) => {
    const fullPath = join(BLOGS_PATH, path);
    const source = readFileSync(fullPath);
    const { data } = matter(source);
    const properties = ['title', 'slug', 'readingTime', 'author', 'authorImage', 'excerpt'];
    validateMandatoryFrontMatterKeys(data, properties, path);
    return data;
  });
