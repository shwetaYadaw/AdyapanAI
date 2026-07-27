import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { logger } from '../utils/logger';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

/**
 * Simple in-memory rate limiter
 * For production, use Redis-based rate limiting
 */
export function rateLimit(req: Request, res: Response, next: NextFunction): void {
  const identifier = req.ip || 'unknown';
  const now = Date.now();

  // Initialize or reset if window expired
  if (!store[identifier] || now > store[identifier].resetTime) {
    store[identifier] = {
      count: 0,
      resetTime: now + env.RATE_LIMIT_WINDOW_MS,
    };
  }

  store[identifier].count++;

  if (store[identifier].count > env.RATE_LIMIT_MAX_REQUESTS) {
    logger.warn('Rate limit exceeded:', { identifier });
    res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. Please try again later.',
      retryAfter: Math.ceil((store[identifier].resetTime - now) / 1000),
    });
    return;
  }

  // Set rate limit headers
  res.setHeader('X-RateLimit-Limit', env.RATE_LIMIT_MAX_REQUESTS);
  res.setHeader('X-RateLimit-Remaining', env.RATE_LIMIT_MAX_REQUESTS - store[identifier].count);
  res.setHeader('X-RateLimit-Reset', store[identifier].resetTime);

  next();
}

/**
 * Cleanup expired rate limit entries periodically
 */
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (now > store[key].resetTime) {
      delete store[key];
    }
  });
}, 60000); // Cleanup every minute
