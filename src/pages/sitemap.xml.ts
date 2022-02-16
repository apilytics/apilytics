import type { GetServerSideProps } from 'next';

import {
  FRONTEND_URL,
  INDEXABLE_BLOG_ROUTES,
  INDEXABLE_CONTENT_ROUTES,
  INDEXABLE_DOCS_ROUTES,
  MISC_INDEXABLE_ROUTES,
  staticRoutes,
} from 'utils/router';

// This should be manually updated whenever we want Google to re-index the sitemap.
const MODIFIED = '2022-02-16';

type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

// https://www.sitemaps.org/protocol.html#xmlTagDefinitions
interface Route {
  path: string;
  changeFreq: ChangeFreq;
  priority: string; // Value from '0.0' to '1.0'
  modified?: string; // ISO date
}

const contentRoutes = INDEXABLE_CONTENT_ROUTES.map((path) => ({
  path,
  changeFreq: 'weekly' as const,
  priority: '0.90',
}));

const docsRoutes = INDEXABLE_DOCS_ROUTES.map((path) => ({
  path,
  changeFreq: 'weekly' as const,
  priority: '0.75',
}));

const blogRoutes = INDEXABLE_BLOG_ROUTES.map((path) => ({
  path,
  changeFreq: 'weekly' as const,
  priority: '0.75',
}));

const miscRoutes = MISC_INDEXABLE_ROUTES.map((path) => ({
  path,
  changeFreq: 'weekly' as const,
  priority: '0.5',
}));

const INDEXABLE_ROUTES: Route[] = [
  { path: staticRoutes.root, changeFreq: 'weekly', priority: '1.0' },
  ...contentRoutes,
  ...docsRoutes,
  ...blogRoutes,
  ...miscRoutes,
];

const toUrl = ({ path, changeFreq, priority }: Route): string => {
  return `
    <url>
      <loc>${FRONTEND_URL}${path}</loc>
      <lastmod>${MODIFIED}</lastmod>
      <changefreq>${changeFreq}</changefreq>
      <priority>${priority}</priority>
    </url>`;
};

const createSitemap = (routes: Route[]): string =>
  // These xmlns URLs have to use http.
  `<?xml version="1.0" encoding="UTF-8"?>
    <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xhtml="http://www.w3.org/1999/xhtml"
    >
      ${routes.map((route) => toUrl(route)).join('')}
    </urlset>`;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemap = createSitemap(INDEXABLE_ROUTES);
  res.setHeader('Content-Type', 'application/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

/* eslint @typescript-eslint/no-empty-function: "off" */
const SitemapXml = (): void => {};

export default SitemapXml;
