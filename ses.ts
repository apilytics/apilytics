import AWS from 'aws-sdk';

const SES_CONFIG = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION,
};

export const AWS_SES = new AWS.SES(SES_CONFIG);
