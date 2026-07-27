import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for execution endpoints
 */
export const executionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: {
    success: false,
    message: 'Too many execution requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for submission endpoints
 */
export const submissionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 submissions per minute
  message: {
    success: false,
    message: 'Too many submissions, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
