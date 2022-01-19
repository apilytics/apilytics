import slugify from 'slugify';
import type { Origin } from '@prisma/client';

import { getSessionUserId, makeMethodsHandler } from 'lib-server/apiHelpers';
import { withAuthRequired } from 'lib-server/middleware';
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

  const data = await prisma.origin.findMany({
    where: { userId },
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

const handler = withAuthRequired(makeMethodsHandler({ GET: handleGet, POST: handlePost }));

export default withApilytics(handler);
