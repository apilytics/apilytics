export const TITLE = 'Apilytics - API analytics made easy';

export const DESCRIPTION =
  'Apilytics is a service that lets you analyze operational, performance and security metrics from your APIs easily.';

// `NEXT_PUBLIC_APP_URL` is defined everywhere except in preview environments
// (where the URL changes always), there we'll use `VERCEL_URL`.
export const FRONTEND_URL = process.env.NEXT_PUBLIC_APP_URL || `https://${process.env.VERCEL_URL}`;

export const FRONTEND_DOMAIN = new URL(FRONTEND_URL).host;

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

export const MOCK_ENDPOINTS = [
  {
    name: '/profile',
    methods: ['GET', 'PUT', 'DELETE'],
    status_codes: [200],
  },
  {
    name: '/users',
    methods: ['GET'],
    status_codes: [200],
  },
  {
    name: '/users/johndoe',
    methods: ['GET', 'POST', 'PUT'],
    status_codes: [200],
  },
  {
    name: '/users/janedoe',
    methods: ['GET', 'POST', 'PUT'],
    status_codes: [200],
  },
  {
    name: '/posts',
    methods: ['GET'],
    status_codes: [200],
  },
  {
    name: '/posts/123',
    methods: ['GET'],
    status_codes: [200, 404],
  },
  {
    name: '/posts/345',
    methods: ['GET'],
    status_codes: [200, 404],
  },
  {
    name: '/posts/345',
    methods: ['GET'],
    status_codes: [200, 404],
  },
  {
    name: '/users/johndoe',
    methods: ['GET'],
    status_codes: [200, 201],
  },
  {
    name: '/login',
    methods: ['POST'],
    status_codes: [200, 500],
  },
  {
    name: '/logout',
    methods: ['POST'],
    status_codes: [200],
  },
  {
    name: '/contact',
    methods: ['POST'],
    status_codes: [201],
  },
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
