import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

/**
 * API Key authentication middleware
 */
export function authenticateApiKey(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    res.status(401).json({
      success: false,
      message: 'API key is required',
    });
    return;
  }

  if (apiKey !== env.API_KEY) {
    res.status(403).json({
      success: false,
      message: 'Invalid API key',
    });
    return;
  }

  next();
}
