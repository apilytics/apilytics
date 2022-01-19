import type { Metric } from '@prisma/client';

import { makeMethodsHandler } from 'lib-server/apiHelpers';
import {
  sendApiKeyMissing,
  sendInvalidApiKey,
  sendMissingInput,
  sendOk,
} from 'lib-server/responses';
import prisma from 'prisma/client';
import { isInconsistentColumnData } from 'prisma/errors';
import type { ApiHandler } from 'types';

type RequiredFields = Pick<Metric, 'path' | 'method' | 'statusCode' | 'timeMillis'>;
// All fields added after v1.0.0 middleware packages need to be optional to ensure backwards compatibility.
type OptionalFields = { query?: 'string' };
type PostBody = RequiredFields & OptionalFields;

/**
 * @swagger
 * /api/v1/middleware:
 *   post:
 *     summary: Log a metric from an origin
 *     description: Log a metric from an origin. A metric is thought to correspond to a user's single request/response cycle.
 *       This is called by all Apilytics open source middleware packages. Can be called manually from any custom code as well.
 *     parameters:
 *       - in: header
 *         name: X-API-Key
 *         description: The API key for your Apilytics origin.
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *       - in: header
 *         name: Apilytics-Version
 *         description: A version string identifying the official Apilytics middleware package in use.
 *           This should be omitted if calling this API from custom, non-official code.
 *         schema:
 *           type: string
 *         required: false
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               path:
 *                 type: string
 *                 description: Path of the user's HTTP request.
 *                 example: "/foo/bar/123"
 *               query:
 *                 type: string
 *                 description: Query string of the user's HTTP request. An empty string is treated
 *                   as if this were omitted. Can have an optional "?" at the start.
 *                 example: "key=val&other=123"
 *               method:
 *                 type: string
 *                 description: Method of the user's HTTP request.
 *                 example: "GET"
 *               statusCode:
 *                 type: integer
 *                 nullable: true
 *                 description: Status code for the sent HTTP response. Can be `null` if the middleware could not get
 *                   the status code for the response. E.g. if the inner request handling threw an exception.
 *                 example: 200
 *               timeMillis:
 *                 type: integer
 *                 description: The amount of time in milliseconds it took to responsd to the user's request.
 *                 example: 15
 *             required:
 *               - path
 *               - method
 *               - statusCode
 *               - timeMillis
 *     responses:
 *       200:
 *         description: On success.
 *       400:
 *         description: Invalid request body, missing some required values.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input. Missing values for: path, method"
 *       401:
 *         description: Request is missing the X-API-Key header.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing X-API-Key header."
 *       403:
 *         description: Invalid or unrecognized API Key in the X-API-Key header.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid API key."
 */
const handlePost: ApiHandler = async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (typeof apiKey !== 'string' || !apiKey) {
    sendApiKeyMissing(res);
    return;
  }

  let origin;

  try {
    origin = await prisma.origin.findUnique({ where: { apiKey } });
  } catch (e) {
    if (!isInconsistentColumnData(e)) {
      throw e;
    }
    // Was not a valid UUID.
  }

  if (!origin) {
    sendInvalidApiKey(res);
    return;
  }

  const requiredFields: (keyof RequiredFields)[] = ['path', 'method', 'statusCode', 'timeMillis'];
  const missing = requiredFields.filter((field) => req.body[field] === undefined);
  if (missing.length) {
    sendMissingInput(res, missing);
    return;
  }

  const { path, query, method, statusCode, timeMillis } = req.body as PostBody;

  const queryParams = query ? Object.fromEntries(new URLSearchParams(query)) : undefined;

  const apilyticsVersion =
    typeof req.headers['apilytics-version'] === 'string'
      ? req.headers['apilytics-version']
      : undefined;

  await prisma.metric.create({
    data: {
      originId: origin.id,
      path,
      queryParams,
      method,
      statusCode,
      timeMillis,
      apilyticsVersion,
    },
  });

  sendOk(res);
};

const handler = makeMethodsHandler({ POST: handlePost });

export default handler;
