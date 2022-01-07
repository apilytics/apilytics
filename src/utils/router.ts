export const staticRoutes = {
  root: '/',
  login: '/login',
  logout: '/logout',
  demo: '/demo',
  privacy: '/privacy',
  origins: '/origins',
  newOrigin: '/new-origin',
  account: '/account',
  docs: '/docs',
  getStarted: '/docs/get-started',
  byom: '/docs/byom',
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
};

export const dynamicApiRoutes: DynamicRoutes = {
  origin: ({ slug }) => `/api/origins/${slug}`,
  originMetrics: ({ slug, from, to }) => `/api/origins/${slug}/metrics?from=${from}&to=${to}`,
};
