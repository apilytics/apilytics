export const staticRoutes = {
  root: '/',
  login: '/login',
  logout: '/logout',
  demo: '/demo',
  privacyPolicy: '/privacy-policy',
  origins: '/origins',
  newOrigin: '/new-origin',
  account: '/account',
  contact: '/contact',
  blog: '/blog',
  docs: '/docs',
  about: '/about',
  privacyFriendly: '/privacy-friendly',
  lightweight: '/lightweight',
  openSource: '/open-source',
  easeOfUse: '/ease-of-use',
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
