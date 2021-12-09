import { Prisma } from '@prisma/client';

import { mockNextApiReqRes, prismaMock } from '__tests__/__helpers__';
import handler from 'pages/api/signup';
import type { SignUpBody } from 'pages/api/signup';

describe('/api/waitlist', () => {
  const body: SignUpBody = {
    role: 'Software Engineer',
    useCases: 'Making my API faster',
    howThisCouldHelp: 'I need to get more data from my API.',
    willingToPay: true,
    email: 'testuser@test.test',
  };

  it('should only accept POST requests', async () => {
    const { req, res } = mockNextApiReqRes({
      method: 'GET',
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(405);
  });

  it('should reject missing values', async () => {
    for (const key of Object.keys(body)) {
      const { req, res } = mockNextApiReqRes({
        method: 'POST',
        body: {
          ...body,
          [key]: undefined,
        },
      });
      await handler(req, res);
      expect(res._getStatusCode()).toBe(400);
    }
  });

  it('should reject an invalid email', async () => {
    const { req, res } = mockNextApiReqRes({
      method: 'POST',
      body: { email: 'test.test' },
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
  });

  it('should add the user to the waitlist', async () => {
    const { req, res } = mockNextApiReqRes({
      method: 'POST',
      body,
    });

    await handler(req, res);
    expect(prismaMock.user.create).toHaveBeenCalledWith({ data: body });
    expect(res._getStatusCode()).toBe(201);
  });

  it('should give an error if user is already on the waitlist', async () => {
    const { req, res } = mockNextApiReqRes({
      method: 'POST',
      body,
    });
    prismaMock.user.create.mockImplementation(() => {
      throw new Prisma.PrismaClientKnownRequestError('', 'P2002', '');
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(409);
  });
});
