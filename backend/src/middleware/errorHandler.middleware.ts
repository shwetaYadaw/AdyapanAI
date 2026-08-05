import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';
import { sendError } from '../utils/response.utils';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function notFoundHandler(req: Request, res: Response): void {
  sendError({
    res,
    statusCode: 404,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
}

export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    userId: req.user?.userId,
  });

  // Operational errors (expected)
  if (err instanceof AppError) {
    sendError({ res, statusCode: err.statusCode, message: err.message });
    return;
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    const errors: Record<string, string> = {};
    err.errors.forEach((e) => {
      errors[e.path.join('.')] = e.message;
    });
    sendError({ res, statusCode: 422, message: 'Validation failed', errors });
    return;
  }

  // Prisma unique constraint violation (duplicate key)
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
    const fields = (err.meta?.target as string[]) ?? [];
    sendError({
      res,
      statusCode: 409,
      message: `${fields.join(', ')} already exists`,
    });
    return;
  }

  // Prisma record not found
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
    sendError({ res, statusCode: 404, message: 'Record not found' });
    return;
  }

  // Prisma validation error
  if (err instanceof Prisma.PrismaClientValidationError) {
    sendError({ res, statusCode: 400, message: 'Invalid data provided' });
    return;
  }

  // Default: unknown server error
  const isDev = process.env.NODE_ENV !== 'production';
  sendError({
    res,
    statusCode: 500,
    message: isDev ? `Server error: ${err.message}` : 'Something went wrong. Please try again.',
  });
}
