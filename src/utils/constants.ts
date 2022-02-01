export const DESCRIPTION =
  'Apilytics is an easy to use, lightweight, privacy friendly application monitoring service. Simple 5 minute installation, all data stored in the EU with full GDPR compliance.';

// A shorter < 160 character version.
export const DEFAULT_SEO_DESCRIPTION =
  'Apilytics is an easy to use, lightweight, privacy friendly application monitoring service. Simple 5 minute installation with full GDPR compliance';

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

export type Method = typeof METHODS[number];

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

interface MockMetric {
  path: string;
  method: string;
  statusCodes: number[];
}

export const MOCK_METRICS: MockMetric[] = [
  {
    path: '/profile',
    method: 'GET',
    statusCodes: [200],
  },
  {
    path: '/profile',
    method: 'PUT',
    statusCodes: [200, 400],
  },
  {
    path: '/profile',
    method: 'DELETE',
    statusCodes: [204],
  },
  {
    path: '/profile',
    method: 'OPTIONS',
    statusCodes: [200],
  },
  {
    path: '/users',
    method: 'GET',
    statusCodes: [200, 401],
  },
  {
    path: '/users/johndoe',
    method: 'GET',
    statusCodes: [200],
  },
  {
    path: '/users/johndoe',
    method: 'PUT',
    statusCodes: [200, 403],
  },
  {
    path: '/users/johndoe',
    method: 'PATCH',
    statusCodes: [200],
  },
  {
    path: '/users/janedoe',
    method: 'GET',
    statusCodes: [200],
  },
  {
    path: '/users/janedoe',
    method: 'PUT',
    statusCodes: [200],
  },
  {
    path: '/posts',
    method: 'GET',
    statusCodes: [200],
  },
  {
    path: '/posts',
    method: 'POST',
    statusCodes: [204],
  },
  {
    path: '/posts/123',
    method: 'GET',
    statusCodes: [404],
  },
  {
    path: '/posts/123',
    method: 'PUT',
    statusCodes: [404],
  },
  {
    path: '/posts/456',
    method: 'GET',
    statusCodes: [200],
  },
  {
    path: '/posts/789',
    method: 'GET',
    statusCodes: [200],
  },
  {
    path: '/posts/789',
    method: 'PUT',
    statusCodes: [401, 403],
  },
  {
    path: '/posts/789',
    method: 'PATCH',
    statusCodes: [403],
  },
  {
    path: '/login',
    method: 'POST',
    statusCodes: [200, 500],
  },
  {
    path: '/login',
    method: 'OPTIONS',
    statusCodes: [200],
  },
  {
    path: '/logout',
    method: 'POST',
    statusCodes: [200],
  },
  {
    path: '/contact',
    method: 'POST',
    statusCodes: [200],
  },
  {
    path: '/blogs',
    method: 'GET',
    statusCodes: [200],
  },
  {
    path: '/blogs',
    method: 'POST',
    statusCodes: [201],
  },
  {
    path: '/blogs/123',
    method: 'GET',
    statusCodes: [200],
  },
  {
    path: '/blogs/123',
    method: 'PATCH',
    statusCodes: [200],
  },
  {
    path: '/blogs/456',
    method: 'GET',
    statusCodes: [200],
  },
  {
    path: '/blogs/456',
    method: 'DELETE',
    statusCodes: [204],
  },
  {
    path: '/blogs/789',
    method: 'GET',
    statusCodes: [200],
  },
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
  requests: 'requests',
  responseTimes: 'response-times',
  requestDetails: 'request-details',
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
