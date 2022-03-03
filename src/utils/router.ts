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
  2: '/blog/announcing-apilytics-api',
  3: '/blog/monitoring-dynamic-api-routes',
  4: '/blog/error-monitoring-with-apilytics',
  5: '/blog/cpu-and-memory-monitoring-with-node',
};

const COMMUNITY_ROUTES = {
  github: 'https://github.com/apilytics',
  roadmap: 'https://github.com/apilytics/roadmap',
  twitter: 'https://twitter.com/apilytics',
  reddit: 'https://reddit.com/r/apilytics',
};

export const staticRoutes = {
  root: '/',
  pricing: '/#pricing',
  login: '/login',
  register: '/register',
  logout: '/logout',
  demo: '/demo',
  origins: '/origins',
  newOrigin: '/new-origin',
  account: '/account',
  contact: '/contact',
  privacyPolicy: '/privacy-policy',
  terms: '/terms',
  about: '/about',
  privacyFriendly: '/privacy-friendly',
  lightweight: '/lightweight',
  openSource: '/open-source',
  easeOfUse: '/ease-of-use',
  changelog: '/changelog',
  forStartups: '/for-startups',
  forConsultants: '/for-consultants',
  ...DOCS_ROUTES,
  ...BLOG_ROUTES,
  ...COMMUNITY_ROUTES,
};

export const INDEXABLE_CONTENT_ROUTES = [
  staticRoutes.about,
  staticRoutes.privacyFriendly,
  staticRoutes.lightweight,
  staticRoutes.openSource,
  staticRoutes.easeOfUse,
  staticRoutes.changelog,
  staticRoutes.forStartups,
  staticRoutes.forConsultants,
];

export const INDEXABLE_DOCS_ROUTES = Object.values(DOCS_ROUTES);

export const INDEXABLE_BLOG_ROUTES = Object.values(BLOG_ROUTES);

export const MISC_INDEXABLE_ROUTES = [
  staticRoutes.demo,
  staticRoutes.login,
  staticRoutes.register,
  staticRoutes.contact,
];

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
  originDynamicRoutes: ({ slug }) => `/origins/${slug}/dynamic-routes`,
  originExcludedRoutes: ({ slug }) => `/origins/${slug}/excluded-routes`,
  originUsers: ({ slug }) => `/origins/${slug}/users`,
  blog: ({ slug }) => `/blog/${slug}`,
};

export const staticApiRoutes = {
  emailSignIn: '/api/auth/signin/email',
  csrfToken: '/api/auth/csrf',
  user: '/api/user',
  originInvites: '/api/origin-invites',
  origins: '/api/origins',
  emailList: '/api/email-list',
  contact: '/api/contact',
};

export const dynamicApiRoutes: DynamicRoutes = {
  origin: ({ slug }) => `/api/origins/${slug}`,
  originMetrics: ({ slug, ...params }) =>
    `/api/origins/${slug}/metrics?${new URLSearchParams(params)}`,
  dynamicRoutes: ({ slug }) => `/api/origins/${slug}/dynamic-routes`,
  excludedRoutes: ({ slug }) => `/api/origins/${slug}/excluded-routes`,
  originUsers: ({ slug }) => `/api/origins/${slug}/users`,
  originUser: ({ slug, originUserId }) => `/api/origins/${slug}/users/${originUserId}`,
  originInvites: ({ slug }) => `/api/origins/${slug}/invites`,
  originInvite: ({ slug, originInviteId }) => `/api/origins/${slug}/invites/${originInviteId}`,
};
