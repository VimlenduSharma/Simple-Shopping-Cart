import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import logger from '../config/logger';
import { ApiError } from '../utils/apiError';
import { isProd } from '../config/env';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction, // required for Express 4 signature even if unused
): void {
  /* --------------------------------------------------------------------- */
  /* 1. Identify error type                                                */
  /* --------------------------------------------------------------------- */
  let status = 500;
  let message = 'Internal Server Error';
  let details: unknown = undefined;

  // Custom application errors
  if (err instanceof ApiError) {
    status = err.statusCode;
    message = err.message;
  }
  // Zod validation errors
  else if (err instanceof ZodError) {
    status = 400;
    message = 'Invalid request data';
    details = err.flatten();
  }
  // Generic built-in Error
  else if (err instanceof Error) {
    message = err.message;
  }

  /* --------------------------------------------------------------------- */
  /* 2. Log the error (full stack)                                         */
  /* --------------------------------------------------------------------- */
  logger.error(err);

  /* --------------------------------------------------------------------- */
  /* 3. Send uniform JSON response                                         */
  /* --------------------------------------------------------------------- */
  res.status(status).json({
    status: 'error',
    message,
    ...(details ? { details } : {}),
    ...(isProd ? {} : { stack: err instanceof Error ? err.stack : err }),
  });
}