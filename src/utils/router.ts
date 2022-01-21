export const CONTENT_ROUTES = {
  about: '/about',
  privacyFriendly: '/privacy-friendly',
  lightweight: '/lightweight',
  openSource: '/open-source',
  easeOfUse: '/ease-of-use',
};

export const DOCS_ROUTES = {
  docs: '/docs',
  getStarted: '/docs/get-started',
  node: '/docs/node',
  python: '/docs/python',
  dashboard: '/docs/dashboard',
  byom: '/docs/dashboard',
  apiDocs: '/api/docs',
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
  ...CONTENT_ROUTES,
  ...DOCS_ROUTES,
  ...BLOG_ROUTES,
};

type DynamicRoutes = Record<string, (args: Record<string, string>) => string>;

export const dynamicRoutes: DynamicRoutes = {
  origin: ({ slug }) => `/origins/${slug}`,
  originSettings: ({ slug }) => `/origins/${slug}/settings`,
  blog: ({ slug }) => `/blog/${slug}`,
};

export const staticApiRoutes = {
  emailSignIn: '/api/auth/signin/email',
  csrfToken: '/api/auth/csrf',
  account: '/api/account',
  origins: '/api/origins',
  emailList: '/api/email-list',
  contact: '/api/contact',
};

export const dynamicApiRoutes: DynamicRoutes = {
  origin: ({ slug }) => `/api/origins/${slug}`,
  originMetrics: ({ slug, from, to }) => `/api/origins/${slug}/metrics?from=${from}&to=${to}`,
};
