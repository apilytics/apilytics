export const TITLE = 'Apilytics - API analytics made easy';

export const DESCRIPTION =
  'Analyze operational, performance and security metrics from your APIs without infrastructure-level logging.';

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

export const LAST_24_HOURS_VALUE = 1;
export const LAST_7_DAYS_VALUE = 7;
export const LAST_30_DAYS_VALUE = 30;
export const LAST_3_MONTHS_VALUE = 90;
export const LAST_6_MONTHS_VALUE = 180;
export const LAST_12_MONTHS_VALUE = 365;

export const TIME_FRAME_OPTIONS = {
  [LAST_24_HOURS_VALUE]: 'Last 24 hours',
  [LAST_7_DAYS_VALUE]: 'Last 7 days',
  [LAST_30_DAYS_VALUE]: 'Last 30 days',
  [LAST_3_MONTHS_VALUE]: 'Last 3 months',
  [LAST_6_MONTHS_VALUE]: 'Last 6 months',
  [LAST_12_MONTHS_VALUE]: 'Last 12 months',
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
    name: '/users/johndoe',
    methods: ['GET'],
    status_codes: [200, 201],
  },
  {
    name: '/login',
    methods: ['POST'],
    status_codes: [200, 500],
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
