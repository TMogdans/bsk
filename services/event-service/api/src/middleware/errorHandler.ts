import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { createLogger } from '../utils/logger';
import createHttpError from 'http-errors';
import { config } from '../config';

const logger = createLogger('errorHandler');

class ApplicationError extends Error {
  constructor(
    public message: string, 
    public statusCode = 500, 
    public type = 'ApplicationError',
    public details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends ApplicationError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'BadRequestError', details);
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message: string) {
    super(message, 404, 'NotFoundError');
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string, details: unknown) {
    super(message, 400, 'ValidationError', details);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  logger.error({ err }, 'Error occurred');

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      type: 'ValidationError',
      details: err.format(),
    });
  }

  // Handle our application errors
  if (err instanceof ApplicationError) {
    return res.status(err.statusCode).json({
      error: err.message,
      type: err.type,
      details: err.details,
    });
  }

  // Handle http-errors
  if (createHttpError.isHttpError(err)) {
    return res.status(err.statusCode).json({
      error: err.message,
      type: err.name,
    });
  }

  // Default error handler
  return res.status(500).json({
    error: 'Internal Server Error',
    type: 'ServerError',
    message: config.env === 'production' ? 'An unexpected error occurred' : err.message,
  });
};