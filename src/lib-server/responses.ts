import type { NextApiResponse } from 'next';

export const sendOk = <T>(res: NextApiResponse<T>, data?: T): void => {
  if (data !== undefined) {
    res.status(200).json(data);
  } else {
    res.status(200).end();
  }
};

export const sendCreated = <T>(res: NextApiResponse<T>, data: T): void => {
  res.status(201).json(data);
};

export const sendNoContent = (res: NextApiResponse): void => {
  res.status(204).end();
};

export const sendInvalidInput = (res: NextApiResponse, message = 'Invalid input.'): void => {
  res.status(400).json({ message });
};

export const sendMissingInput = (res: NextApiResponse, fields: string[]): void => {
  res.status(400).json({ message: `Invalid input. Missing values for: ${fields.join(', ')}` });
};

export const sendApiKeyMissing = (res: NextApiResponse): void => {
  res.status(401).json({ message: 'Missing X-API-Key header.' });
};

export const sendUnauthorized = (res: NextApiResponse): void => {
  res.status(401).json({ message: 'Only allowed for logged in users.' });
};

export const sendInvalidApiKey = (res: NextApiResponse): void => {
  res.status(403).json({ message: 'Invalid API key.' });
};

export const sendNotFound = (res: NextApiResponse, objectName: string): void => {
  res.status(404).json({ message: `${objectName} not found.` });
};

export const sendMethodNotAllowed = (res: NextApiResponse, allowed: string[]): void => {
  res.setHeader('Allow', allowed.join(', '));
  res.status(405).json({ message: 'Method not allowed.' });
};

export const sendConflict = (res: NextApiResponse, message: string): void => {
  res.status(409).json({ message });
};

export const sendUnknownError = (res: NextApiResponse): void => {
  res.status(500).json({ message: 'An unknown error occurred, trying again might help.' });
};
