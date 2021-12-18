export const TITLE = 'Simple analytics for your APIs';

export const DESCRIPTION =
  'Apilytics allows you to monitor & visualize operational, performance and security metrics from your APIs.';

// `NEXT_PUBLIC_APP_URL` is defined everywhere except in preview environments
// (where the URL changes always), there we'll use `VERCEL_URL`.
export const FRONTEND_URL = process.env.NEXT_PUBLIC_APP_URL || `https://${process.env.VERCEL_URL}`;

export const FRONTEND_DOMAIN = new URL(FRONTEND_URL).host;
