import { Response } from 'express';

export type SuccessPayload<T = unknown, M = unknown> = {
  status: 'success';
  data?: T;
  message?: string;
  meta?: M;
};

export function sendSuccess<T = unknown, M = unknown>(
  res: Response,
  data: T | null = null,
  status = 200,
  message?: string,
  meta?: M,
): Response<SuccessPayload<T, M>> {
  const payload: SuccessPayload<T, M> = { status: 'success' };

  if (data !== null) payload.data = data;
  if (message) payload.message = message;
  if (meta) payload.meta = meta;

  return res.status(status).json(payload);
}