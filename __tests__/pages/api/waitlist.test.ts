import { mockNextApiReqRes, prismaMock } from '__tests__/__helpers__';
import { Prisma } from '@prisma/client';
import handler from 'pages/api/waitlist';

describe('/api/waitlist', () => {
  const userData = { email: 'testuser@test.test' };

  it('should only accept POST requests', async () => {
    const { req, res } = mockNextApiReqRes({
      method: 'GET',
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(405);
  });

  it('should reject a missing email', async () => {
    const { req, res } = mockNextApiReqRes({
      method: 'POST',
      body: {},
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
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
      body: userData,
    });

    await handler(req, res);
    expect(prismaMock.user.create).toHaveBeenCalledWith({ data: userData });
    expect(res._getStatusCode()).toBe(201);
  });

  it('should give an error if user is already on the waitlist', async () => {
    const { req, res } = mockNextApiReqRes({
      method: 'POST',
      body: userData,
    });
    prismaMock.user.create.mockImplementation(() => {
      throw new Prisma.PrismaClientKnownRequestError('', 'P2002', '');
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(409);
  });
});
