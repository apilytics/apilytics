import AWS from 'aws-sdk';

const emailServerUrl = new URL(process.env.EMAIL_SERVER ?? '');
const { username: accessKeyId, password: secretAccessKey } = emailServerUrl;
const region = emailServerUrl.hostname.split('.')[1];

const SES_CONFIG = {
  accessKeyId,
  secretAccessKey,
  region,
};

export const AWS_SES = new AWS.SES(SES_CONFIG);
