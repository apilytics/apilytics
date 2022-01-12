import AWS from 'aws-sdk';

export const AWS_SES = new AWS.SES({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.DEFAULT_REGION,
});
