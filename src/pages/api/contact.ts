import { makeMethodsHandler } from 'lib-server/apiHelpers';
import { sendInvalidInput, sendOk } from 'lib-server/responses';
import { AWS_SES } from 'ses';
import type { ApiHandler } from 'types';

interface EmailParams {
  email: string;
  message: string;
}

const getEmailBody = ({ email, message }: EmailParams): string => `
New contact message from ${email}:

${message}`;

const sendContactEmail = async ({ email, message }: EmailParams): Promise<void> => {
  const { EMAIL_FROM = '' } = process.env;

  const params = {
    Source: EMAIL_FROM,
    Destination: {
      ToAddresses: [EMAIL_FROM],
    },
    ReplyToAddresses: [email],
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: getEmailBody({ email, message }),
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'New contact message',
      },
    },
  };

  if (process.env.NODE_ENV === 'production') {
    try {
      await AWS_SES.sendEmail(params).promise();
    } catch (e) {
      console.error(e);
    }
  } else {
    console.log(params.Message.Subject);
    console.log(params.Message.Body);
  }
};

interface ContactPostResponse {
  message: string;
}

const handlePost: ApiHandler<ContactPostResponse> = async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    sendInvalidInput(res);
    return;
  }

  if (!email.includes('@')) {
    sendInvalidInput(res, 'Invalid email address.');
    return;
  }

  sendContactEmail({ email, message });
  sendOk(res, { message: 'Message has been sent.' });
};

const handler = makeMethodsHandler({ POST: handlePost });

export default handler;
