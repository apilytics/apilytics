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
