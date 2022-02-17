import slugify from 'slugify';
import type { Origin } from '@prisma/client';

import { getOriginForUser, getSessionUserId, makeMethodsHandler } from 'lib-server/apiHelpers';
import { sendConflict, sendCreated, sendInvalidInput, sendOk } from 'lib-server/responses';
import prisma from 'prisma/client';
import { isUniqueConstraintFailed } from 'prisma/errors';
import { withApilytics } from 'utils/apilytics';
import type { ApiHandler } from 'types';

interface GetResponse {
  data: Origin[];
}

const handleGet: ApiHandler<GetResponse> = async (req, res) => {
  const userId = await getSessionUserId(req);

  const data = await getOriginForUser({
    userId,
    many: true,
  });

  sendOk(res, { data });
};

interface PostResponse {
  data: Origin;
}

const handlePost: ApiHandler<PostResponse> = async (req, res) => {
  const userId = await getSessionUserId(req);
  const { name } = req.body;

  if (!name) {
    sendInvalidInput(res);
    return;
  }

  let origin;
  const slug = slugify(name, { lower: true });

  try {
    origin = await prisma.origin.create({
      data: { userId, name, slug },
    });
  } catch (e) {
    if (isUniqueConstraintFailed(e)) {
      sendConflict(res, 'An origin with this name already exists.');
      return;
    }
    throw e;
  }

  sendCreated(res, { data: origin });
};

const handler = makeMethodsHandler({ GET: handleGet, POST: handlePost }, true);

export default withApilytics(handler);
