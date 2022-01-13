import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeHighlight from 'rehype-highlight';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

export const DOCS_PATH = join(process.cwd(), 'src/docs');

export const getDocsFilePaths = (): string[] =>
  readdirSync(DOCS_PATH).filter((path) => /\.mdx?$/.test(path));

export const DOCS_INFO = getDocsFilePaths()
  .map((path) => {
    const fullPath = join(DOCS_PATH, path);
    const source = readFileSync(fullPath);
    return matter(source).data;
  })
  .sort((a, b) => a.order - b.order);

export const getSerializedSource = async (content: string): Promise<MDXRemoteSerializeResult> =>
  serialize(content, {
    mdxOptions: {
      // @ts-ignore Ignore: The plugin simply doesn't have suitable types for here.
      rehypePlugins: [rehypeHighlight],
    },
  });
