import { Prisma } from '@prisma/client';

import { mockNextApiReqRes, prismaMock } from '__tests__/__helpers__';
import handler from 'pages/api/questions';
import type { QuestionsBody } from 'pages/api/questions';

describe('/api/questions', () => {
  const answers = {
    role: 'Software Engineer',
    useCases: 'Making my API faster',
    howThisCouldHelp: 'I need to get more data from my API.',
    willingToPay: true,
  };
  const body: QuestionsBody = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    ...answers,
  };

  it('should only accept POST requests', async () => {
    const { req, res } = mockNextApiReqRes({
      method: 'GET',
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(405);
  });

  it('should reject a missing id', async () => {
    const { req, res } = mockNextApiReqRes({
      method: 'POST',
      body: {},
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
  });

  it('should reject an invalid id', async () => {
    const { req, res } = mockNextApiReqRes({
      method: 'POST',
      body: { id: 'invalid' },
    });
    prismaMock.user.update.mockImplementation(() => {
      throw new Prisma.PrismaClientKnownRequestError('', 'P2025', '');
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(404);
  });

  it("should update the user's data with their answers", async () => {
    const { req, res } = mockNextApiReqRes({
      method: 'POST',
      body,
    });

    await handler(req, res);
    expect(prismaMock.user.update).toHaveBeenCalledWith({ where: { id: body.id }, data: answers });
    expect(res._getStatusCode()).toBe(200);
  });
});
