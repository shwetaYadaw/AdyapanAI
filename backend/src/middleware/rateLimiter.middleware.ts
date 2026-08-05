import rateLimit from 'express-rate-limit';
import { sendError } from '../utils/response.utils';
import { Request, Response } from 'express';
import { env } from '../config/env';

const handler = (_req: Request, res: Response) => {
  sendError({
    res,
    statusCode: 429,
    message: 'Too many requests. Please try again later.',
  });
};

/** General API rate limiter: 1000 requests per 15 minutes (increased for dev) */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.isProduction() ? 100 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

/**
 * Keep brute-force protection strict in production, but allow normal local
 * sign-up/login testing without locking the developer out after a few retries.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.isProduction() ? 5 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
  skipSuccessfulRequests: true,
});

/** OTP limiter: 3 OTP requests per 15 minutes */
export const otpRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

/** AI feature limiter: 20 requests per minute */
export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
  keyGenerator: (req) => req.user?.userId ?? req.ip ?? 'anonymous',
});

/** Upload limiter: 10 uploads per hour */
export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
  keyGenerator: (req) => req.user?.userId ?? req.ip ?? 'anonymous',
});
