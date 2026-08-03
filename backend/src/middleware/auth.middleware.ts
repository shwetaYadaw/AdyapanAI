import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, isTokenBlacklisted } from '../utils/jwt.utils';
import { prisma } from '../config/prisma';
import { sendError } from '../utils/response.utils';
import { logger } from '../utils/logger';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      sendError({ res, statusCode: 401, message: 'Authentication required' });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Check blacklist (skip if Redis unavailable)
    try {
      const blacklisted = await isTokenBlacklisted(token);
      if (blacklisted) {
        sendError({ res, statusCode: 401, message: 'Token has been revoked' });
        return;
      }
    } catch { /* Redis unavailable — skip blacklist check */ }

    const payload = verifyAccessToken(token);

    // Verify user still exists and is active (MySQL via Prisma)
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      sendError({ res, statusCode: 401, message: 'User account is inactive or not found' });
      return;
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    logger.debug('Auth middleware error:', error);
    sendError({ res, statusCode: 401, message: 'Invalid or expired token' });
  }
}

export function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = verifyAccessToken(token);
    } catch {
      // Ignore errors, continue as unauthenticated
    }
  }
  next();
}
