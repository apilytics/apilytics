// `NEXT_PUBLIC_APP_URL` is defined everywhere except in preview environments
// (where the URL changes always), there we'll use `VERCEL_URL`.
export const FRONTEND_URL = process.env.NEXT_PUBLIC_APP_URL || `https://${process.env.VERCEL_URL}`;

export const DOCS_ROUTES = {
  docs: '/docs',
  getStarted: '/docs/get-started',
  node: '/docs/node',
  python: '/docs/python',
  dashboard: '/docs/dashboard',
  byom: '/docs/byom',
  apiDocs: '/docs/api',
};

export const BLOG_ROUTES = {
  blog: '/blog',
  1: '/blog/problem-with-api-monitoring',
};

export const staticRoutes = {
  root: '/',
  login: '/login',
  logout: '/logout',
  demo: '/demo',
  origins: '/origins',
  newOrigin: '/new-origin',
  account: '/account',
  contact: '/contact',
  privacyPolicy: '/privacy-policy',
  about: '/about',
  privacyFriendly: '/privacy-friendly',
  lightweight: '/lightweight',
  openSource: '/open-source',
  easeOfUse: '/ease-of-use',
  ...DOCS_ROUTES,
  ...BLOG_ROUTES,
};

export const INDEXABLE_CONTENT_ROUTES = [
  staticRoutes.about,
  staticRoutes.privacyFriendly,
  staticRoutes.lightweight,
  staticRoutes.openSource,
  staticRoutes.easeOfUse,
];

export const INDEXABLE_DOCS_ROUTES = Object.values(DOCS_ROUTES);

export const INDEXABLE_BLOG_ROUTES = Object.values(BLOG_ROUTES);

export const MISC_INDEXABLE_ROUTES = [staticRoutes.demo];

export const INDEXABLE_ROUTES = [
  staticRoutes.root,
  ...INDEXABLE_CONTENT_ROUTES,
  ...INDEXABLE_DOCS_ROUTES,
  ...INDEXABLE_BLOG_ROUTES,
  ...MISC_INDEXABLE_ROUTES,
];

type DynamicRoutes = Record<string, (args: Record<string, string>) => string>;

export const dynamicRoutes: DynamicRoutes = {
  origin: ({ slug }) => `/origins/${slug}`,
  originSettings: ({ slug }) => `/origins/${slug}/settings`,
  blog: ({ slug }) => `/blog/${slug}`,
};

export const staticApiRoutes = {
  emailSignIn: '/api/auth/signin/email',
  csrfToken: '/api/auth/csrf',
  user: '/api/user',
  origins: '/api/origins',
  emailList: '/api/email-list',
  contact: '/api/contact',
};

export const dynamicApiRoutes: DynamicRoutes = {
  origin: ({ slug }) => `/api/origins/${slug}`,
  originMetrics: ({ slug, from, to }) => `/api/origins/${slug}/metrics?from=${from}&to=${to}`,
};
