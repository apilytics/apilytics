import type { GetServerSideProps } from 'next';

import { FRONTEND_URL } from 'utils/constants';
import { staticRoutes } from 'utils/router';

type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

// https://www.sitemaps.org/protocol.html#xmlTagDefinitions
interface Route {
  path: string;
  changeFreq: ChangeFreq;
  priority: string; // Value from '0.0' to '1.0'
  modified?: string; // ISO date
}

const CONTENT_ROUTES = [
  staticRoutes.about,
  staticRoutes.easeOfUse,
  staticRoutes.lightweight,
  staticRoutes.openSource,
  staticRoutes.privacyFriendly,
].map((path) => ({
  path,
  changeFreq: 'weekly' as const,
  priority: '0.90',
}));

const DOCS_ROUTES = ['', '/get-started', '/node', '/python', '/dashboard', '/byom'].map((path) => ({
  path: `/docs${path}`,
  changeFreq: 'weekly' as const,
  priority: '0.75',
}));

const BLOG_ROUTES = ['', '/problem-with-api-monitoring'].map((path) => ({
  path: `/blog${path}`,
  changeFreq: 'weekly' as const,
  priority: '0.75',
}));

// We only want to index the landing page for now.
const INDEXABLE_ROUTES: Route[] = [
  { path: '', changeFreq: 'weekly', priority: '1.0' },
  ...CONTENT_ROUTES,
  ...DOCS_ROUTES,
  ...BLOG_ROUTES,
  { path: staticRoutes.contact, changeFreq: 'weekly', priority: '0.5' },
];

const toUrl = ({ path, modified, changeFreq, priority }: Route): string => {
  return `
    <url>
      <loc>${FRONTEND_URL}${path}</loc>
      <lastmod>${modified}</lastmod>
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
  const modified = process.env.BUILD_DATE || new Date().toISOString().slice(0, 10);

  const routes = INDEXABLE_ROUTES.map((route) => ({
    ...route,
    modified,
  }));

  const sitemap = createSitemap(routes);
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
