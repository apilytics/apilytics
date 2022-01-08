import { safeGetSessionUserId } from 'lib-server/apiHelpers';
import { sendUnauthorized } from 'lib-server/responses';
import type { ApiHandler } from 'types';

export const withAuthRequired = <T extends ApiHandler>(handler: T) => {
  return async (req: Parameters<T>[0], res: Parameters<T>[1]): Promise<void> => {
    const userId = await safeGetSessionUserId(req);

    if (!userId) {
      sendUnauthorized(res);
    } else {
      await handler(req, res);
    }
  };
};
