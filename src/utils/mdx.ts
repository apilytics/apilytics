import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

import matter from 'gray-matter';

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
