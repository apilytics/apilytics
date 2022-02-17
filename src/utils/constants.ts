export const DESCRIPTION =
  'Apilytics is an easy to use, lightweight, privacy-friendly application monitoring service. Simple 5 minute installation, all data stored in the EU with full GDPR compliance.';

// A shorter < 160 character version.
export const DEFAULT_SEO_DESCRIPTION =
  'Apilytics is an easy to use, lightweight, privacy-friendly application monitoring service. Simple 5 minute installation with full GDPR compliance';

export const METHODS = [
  'GET',
  'HEAD',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'OPTIONS',
  'CONNECT',
  'TRACE',
] as const;

export const METHODS_WITHOUT_BODY = ['GET', 'HEAD', 'OPTIONS', 'CONNECT', 'TRACE'];
export const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS', 'TRACE'];

export const DAY = 1;
export const WEEK_DAYS = 7;
export const MONTH_DAYS = 30;
export const THREE_MONTHS_DAYS = 90;
export const SIX_MONTHS_DAYS = 180;
export const YEAR_DAYS = 365;

export const TIME_FRAME_OPTIONS = {
  [DAY]: 'Last 24 hours',
  [WEEK_DAYS]: 'Last 7 days',
  [MONTH_DAYS]: 'Last 30 days',
  [THREE_MONTHS_DAYS]: 'Last 3 months',
  [SIX_MONTHS_DAYS]: 'Last 6 months',
  [YEAR_DAYS]: 'Last 12 months',
};

export const UNEXPECTED_ERROR = 'Unexpected error.';

export const MOCK_PATHS = [
  '/profile',
  '/users',
  '/users/johndoe',
  '/users/janedoe',
  '/posts',
  '/posts/123',
  '/posts/456',
  '/posts/789',
  '/login',
  '/logout',
  '/contact',
  '/blogs',
  '/blogs',
  '/blogs/123',
  '/blogs/456',
  '/blogs/789',
];

export const MOCK_TOTAL_MEMORY = 4_000_000_000; // 4 GB.

export const MOCK_BROWSERS = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Internet Explorer', 'Opera'];

export const MOCK_OPERATING_SYSTEMS = [
  'Android',
  'BlackBerry',
  'Chrome OS',
  'iOS',
  'Linux',
  'Mac OS',
  'Windows',
];
interface MockDynamicRoute {
  route: string;
  pattern: string;
}

export const MOCK_DYNAMIC_ROUTES: MockDynamicRoute[] = [
  { route: '/blogs/<id>', pattern: '/blogs/%' },
  { route: '/posts/<id>', pattern: '/posts/%' },
  { route: '/users/<slug>', pattern: '/users/%' },
];

export const MOCK_ORIGIN = {
  id: 'ff074522-e63c-42f8-b99a-e1619ab8e793',
  name: 'api.example.com',
  slug: 'api-example-com',
  apiKey: 'c78e9721-e3cd-4c9e-8ad3-21dc15c62098',
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: 'a58025e5-cd8a-4586-94b9-d38f51aa9e72',
};

export const MODAL_NAMES = {
  deleteOrigin: 'delete-origin',
  apiKey: 'api-key',
  endpoints: 'endpoints',
  statusCodes: 'status-codes',
  userAgents: 'user-agents',
  dynamicRoute: 'dynamic-route',
  deleteDynamicRoute: 'delete-dynamic-route',
};

export const DEFAULT_MAX_WIDTH = 'max-w-3xl';

// This value is stored in the DB metrics.status_code column to indicate that we didn't get
// a response status code from the middleware, can happen e.g. when an inner request handler
// function that the middleware wraps throws an error.
export const UNKNOWN_STATUS_CODE = 0;

export enum EVENT_LOCATIONS {
  HEADER = 'header',
  PAGE_TOP = 'page-bottom',
  PAGE_BOTTOM = 'page-bottom',
  FOOTER = 'footer',
}

export const PERCENTILE_DATA_KEYS = ['avg', 'p50', 'p75', 'p90', 'p95', 'p99'] as const;

export const DEVICES = ['console', 'mobile', 'tablet', 'smarttv', 'wearable', 'embedded'];
