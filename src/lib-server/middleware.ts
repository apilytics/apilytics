import { getSessionUser } from 'lib-server/apiHelpers';
import type { ApiHandler } from 'lib-server/types';

export const withAuthRequired = <T extends ApiHandler>(handler: T) => {
  return async (req: Parameters<T>[0], res: Parameters<T>[1]): Promise<void> => {
    await getSessionUser(req); // Throws an error if not authorized.
    await handler(req, res);
  };
};
