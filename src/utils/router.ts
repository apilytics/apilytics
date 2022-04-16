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

const CONTENT_ROUTES = {
  terms: '/terms',
  about: '/about',
  privacyFriendly: '/privacy-friendly',
  lightweight: '/lightweight',
  openSource: '/open-source',
  easyToUse: '/easy-to-use',
  changelog: '/changelog',
};

const FOR_ROUTES = {
  forStartups: '/for/startups',
  forConsultants: '/for/consultants',
  forMobileApps: '/for/mobile-apps',
  forMicroServices: '/for/microservices',
  forServerless: '/for/serverless',
  forJS: '/for/javascript',
  forPython: '/for/python',
  forNextJS: '/for/next',
  forExpress: '/for/express',
  forNodeJS: '/for/node',
  forDjango: '/for/django',
  forFastAPI: '/for/fastapi',
  forFlask: '/for/flask',
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
  ...CONTENT_ROUTES,
  ...FOR_ROUTES,
  ...DOCS_ROUTES,
  ...BLOG_ROUTES,
  ...COMMUNITY_ROUTES,
};

export const INDEXABLE_CONTENT_ROUTES = Object.values(CONTENT_ROUTES);
export const INDEXABLE_FOR_ROUTES = Object.values(FOR_ROUTES);
export const INDEXABLE_DOCS_ROUTES = Object.values(DOCS_ROUTES);
export const INDEXABLE_BLOG_ROUTES = Object.values(BLOG_ROUTES);

export const MISC_INDEXABLE_ROUTES = [
  staticRoutes.root,
  staticRoutes.demo,
  staticRoutes.login,
  staticRoutes.register,
  staticRoutes.contact,
];

export const INDEXABLE_ROUTES = [
  ...INDEXABLE_CONTENT_ROUTES,
  ...INDEXABLE_FOR_ROUTES,
  ...INDEXABLE_DOCS_ROUTES,
  ...INDEXABLE_BLOG_ROUTES,
  ...MISC_INDEXABLE_ROUTES,
];

type Slug = { slug: string };
type OriginUserId = { originUserId: string };
type OriginInviteId = { originInviteId: string };

interface OriginMetricParams extends Slug {
  from: string;
  to: string;
  method: string;
  endpoint: string;
  statusCode: string;
  browser: string;
  os: string;
  device: string;
  country: string;
  region: string;
  city: string;
}

export const dynamicRoutes = {
  origin: ({ slug }: Slug): string => `/origins/${slug}`,
  originSettings: ({ slug }: Slug): string => `/origins/${slug}/settings`,
  originDynamicRoutes: ({ slug }: Slug): string => `/origins/${slug}/dynamic-routes`,
  originExcludedRoutes: ({ slug }: Slug): string => `/origins/${slug}/excluded-routes`,
  originUsers: ({ slug }: Slug): string => `/origins/${slug}/users`,
  blog: ({ slug }: Slug): string => `/blog/${slug}`,
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

export const dynamicApiRoutes = {
  origin: ({ slug }: Slug): string => `/api/origins/${slug}`,
  originMetrics: ({
    slug,
    stat,
    ...params
  }: OriginMetricParams & {
    stat: 'endpoint' | 'general' | 'geolocation' | 'misc' | 'timeframe';
  }): string =>
    `/api/origins/${slug}/metrics/${stat}?${new URLSearchParams(
      params as unknown as Record<string, string>,
    )}`,
  originMetricsVersion: ({ slug }: { slug: string }): string =>
    `/api/origins/${slug}/metrics/version`,
  dynamicRoutes: ({ slug }: Slug): string => `/api/origins/${slug}/dynamic-routes`,
  excludedRoutes: ({ slug }: Slug): string => `/api/origins/${slug}/excluded-routes`,
  originUsers: ({ slug }: Slug): string => `/api/origins/${slug}/users`,
  originUser: ({ slug, originUserId }: Slug & OriginUserId): string =>
    `/api/origins/${slug}/users/${originUserId}`,
  originInvites: ({ slug }: Slug): string => `/api/origins/${slug}/invites`,
  originInvite: ({ slug, originInviteId }: Slug & OriginInviteId): string =>
    `/api/origins/${slug}/invites/${originInviteId}`,
} as const;
