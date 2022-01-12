const docsRoutes = {
  docs: '/docs',
  getStarted: '/docs/get-started',
  python: '/docs/python',
  node: '/docs/node',
  dashboard: '/docs/dashboard',
  byom: '/docs/byom',
};

export const staticRoutes = {
  root: '/',
  login: '/login',
  logout: '/logout',
  demo: '/demo',
  privacy: '/privacy',
  origins: '/origins',
  newOrigin: '/new-origin',
  account: '/account',
  contact: '/contact',
  ...docsRoutes,
};

type DynamicRoutes = Record<string, (args: Record<string, string>) => string>;

export const dynamicRoutes: DynamicRoutes = {
  origin: ({ slug }) => `/origins/${slug}`,
  originSettings: ({ slug }) => `/origins/${slug}/settings`,
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
