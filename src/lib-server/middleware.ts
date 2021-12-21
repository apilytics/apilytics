import { safeGetSessionUser, sendUnauthorized } from 'lib-server';
import type { ApiHandler } from 'types';

export const withAuthRequired = <T extends ApiHandler>(handler: T) => {
  return async (req: Parameters<T>[0], res: Parameters<T>[1]): Promise<void> => {
    const user = await safeGetSessionUser(req);
    if (!user) {
      sendUnauthorized(res);
    } else {
      await handler(req, res);
    }
  };
};
