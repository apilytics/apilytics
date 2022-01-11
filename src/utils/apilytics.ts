// Ignore: We need to import the Apilytics module once here to use it elsewhere.
// eslint-disable-next-line no-restricted-imports
import { withApilytics as _withApilytics } from '@apilytics/next';
import type { NextApiHandler } from 'next';

export const withApilytics = (handler: NextApiHandler): NextApiHandler =>
  _withApilytics(handler, process.env.APILYTICS_API_KEY);
