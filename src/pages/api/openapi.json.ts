import { join } from 'path';

import swaggerJsdoc from 'swagger-jsdoc';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (_req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  try {
    const apiDirectory = join(process.cwd(), 'src/pages/api');
    const buildApiDirectory = join(process.cwd(), '.next/server', 'pages/api');

    const options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Apilytics',
          version: '1.0',
        },
      },
      apis: [
        `${apiDirectory}/**/*.js`,
        `${apiDirectory}/**/*.ts`,
        `${apiDirectory}/**/*.tsx`,
        `${buildApiDirectory}/**/*.js`,
      ],
    };

    const spec = swaggerJsdoc(options);
    res.status(200).send(spec);
  } catch (error) {
    res.status(400).send(error);
  }
};

export default handler;
