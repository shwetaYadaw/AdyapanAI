import { Response } from 'express';

interface SuccessOptions<T> {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: T;
}

interface PaginatedOptions<T> {
  res: Response;
  data: T[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

interface ErrorOptions {
  res: Response;
  statusCode?: number;
  message: string;
  errors?: Record<string, string>;
}

export function sendSuccess<T>({
  res,
  statusCode = 200,
  message = 'Success',
  data,
}: SuccessOptions<T>): Response {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendPaginated<T>({
  res,
  data,
  total,
  page,
  limit,
  message = 'Success',
}: PaginatedOptions<T>): Response {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  });
}

export function sendError({
  res,
  statusCode = 500,
  message,
  errors,
}: ErrorOptions): Response {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
}

export function getPaginationParams(query: Record<string, unknown>): {
  page: number;
  limit: number;
  skip: number;
} {
  const page = Math.max(1, parseInt(String(query.page ?? '1'), 10));
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit ?? '20'), 10)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
