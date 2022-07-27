export const DESCRIPTION =
  'Apilytics is an easy to use, lightweight, privacy-friendly application analytics & monitoring service. Simple 5 minute installation, all data stored in the EU with full GDPR compliance.';

// A shorter < 160 character version.
export const DEFAULT_SEO_DESCRIPTION =
  'Apilytics is an easy to use, lightweight, privacy-friendly application analytics & monitoring service. Simple 5 minute installation with full GDPR compliance';

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

export const ONE_DAY = 1;
export const WEEK_DAYS = 7;
export const MONTH_DAYS = 30;
export const THREE_MONTHS_DAYS = 90;
export const SIX_MONTHS_DAYS = 180;
export const YEAR_DAYS = 365;

export const INTERVAL_DAYS = [
  {
    label: 'Last 24 hours',
    value: ONE_DAY,
  },
  {
    label: 'Last 7 days',
    value: WEEK_DAYS,
  },
  {
    label: 'Last 30 days',
    value: MONTH_DAYS,
  },
  {
    label: 'Last 3 months',
    value: THREE_MONTHS_DAYS,
  },
  {
    label: 'Last 6 months',
    value: SIX_MONTHS_DAYS,
  },
  {
    label: 'Last 12 months',
    value: YEAR_DAYS,
  },
];

export const UNEXPECTED_ERROR = 'Unexpected error.';
export const PERMISSION_ERROR = 'You do not have permission to do this action.';

export enum ORIGIN_ROLES {
  OWNER = 'owner',
  ADMIN = 'admin',
  VIEWER = 'viewer',
}

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
  '/excluded/123',
  '/excluded/456',
  '/excluded/789',
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

interface MockRoute {
  route: string;
  pattern: string;
}

export const MOCK_DYNAMIC_ROUTES: MockRoute[] = [
  { route: '/blogs/<id>', pattern: '/blogs/%' },
  { route: '/posts/<id>', pattern: '/posts/%' },
  { route: '/users/<slug>', pattern: '/users/%' },
];

export const MOCK_EXCLUDED_ROUTES: MockRoute[] = [
  { route: '/excluded/<id>', pattern: '/excluded/%' },
];

export const MOCK_ORIGIN = {
  id: 'ff074522-e63c-42f8-b99a-e1619ab8e793',
  name: 'api.example.com',
  slug: 'api-example-com',
  apiKey: 'c78e9721-e3cd-4c9e-8ad3-21dc15c62098',
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: 'a58025e5-cd8a-4586-94b9-d38f51aa9e72',
  userRole: ORIGIN_ROLES.VIEWER,
  userCount: 1,
  dynamicRouteCount: MOCK_DYNAMIC_ROUTES.length,
  excludedRouteCount: 0,
  weeklyEmailReportsEnabled: false,
  lastAutomaticWeeklyEmailReportsSentAt: null,
};

export enum MODAL_NAMES {
  DELETE_ORIGIN = 'DELETE_ORIGIN',
  API_KEY = 'API_KEY',
  ENDPOINTS = 'ENDPOINTS',
  STATUS_CODES = 'STATUS_CODES',
  USER_AGENTS = 'USER_AGENTS',
  DYNAMIC_ROUTE = 'DYNAMIC_ROUTE',
  DELETE_DYNAMIC_ROUTE = 'DELETE_DYNAMIC_ROUTE',
  EXCLUDED_ROUTE = 'EXCLUDED_ROUTE',
  DELETE_EXCLUDED_ROUTE = 'DELETE_EXCLUDED_ROUTE',
  INVITE_ORIGIN_USER = 'INVITE_ORIGIN_USER',
  EDIT_ORIGIN_USER = 'EDIT_ORIGIN_USER',
  DELETE_ORIGIN_USER = 'DELETE_ORIGIN_USER',
  DELETE_ORIGIN_INVITE = 'DELETE_ORIGIN_INVITE',
  RESEND_ORIGIN_INVITE = 'RESEND_ORIGIN_INVITE',
  ACCEPT_ORIGIN_INVITE = 'ACCEPT_ORIGIN_INVITE',
  REJECT_ORIGIN_INVITE = 'REJECT_ORIGIN_INVITE',
  GEO_LOCATION = 'GEO_LOCATION',
  DELETE_RECIPIENT = 'DELETE_RECIPIENT',
  SEE_WEEKLY_EMAIL_REPORT = 'SEE_WEEKLY_EMAIL_REPORT',
  SEND_WEEKLY_EMAIL_REPORTS = 'SEND_WEEKLY_EMAIL_REPORTS',
}

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

export enum ORIGIN_MENU_KEYS {
  SETTINGS = 'SETTINGS',
  DYNAMIC_ROUTES = 'DYNAMIC_ROUTES',
  EXCLUDED_ROUTES = 'EXCLUDED_ROUTES',
  USERS = 'USERS',
  EMAIL_REPORTS = 'EMAIL_REPORTS',
}

export const REQUEST_TIME_FORMAT = 'YYYY-MM-DD:HH:mm';
