import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.utils';

type AllowedRole =
  | 'student'
  | 'teacher'
  | 'mentor'
  | 'recruiter'
  | 'admin'
  | 'superadmin';

/**
 * Authorize one or more roles.
 * Usage: authorize('admin', 'superadmin')
 */
export function authorize(...roles: AllowedRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError({ res, statusCode: 401, message: 'Authentication required' });
      return;
    }

    const userRole = req.user.role as AllowedRole;

    // Superadmin bypasses all role checks
    if (userRole === 'superadmin') {
      next();
      return;
    }

    if (!roles.includes(userRole)) {
      sendError({
        res,
        statusCode: 403,
        message: `Access denied. Required role: ${roles.join(' or ')}`,
      });
      return;
    }

    next();
  };
}

/**
 * Check resource ownership. Attaches isOwner flag to request.
 * Usage: For routes where a user can only edit their own resources.
 */
export function requireOwnership(
  getResourceUserId: (req: Request) => string | undefined
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError({ res, statusCode: 401, message: 'Authentication required' });
      return;
    }

    // Admins and superadmins can access any resource
    if (['admin', 'superadmin'].includes(req.user.role)) {
      next();
      return;
    }

    const resourceOwnerId = getResourceUserId(req);
    if (!resourceOwnerId || resourceOwnerId.toString() !== req.user.userId.toString()) {
      sendError({ res, statusCode: 403, message: 'Access denied. You do not own this resource.' });
      return;
    }

    next();
  };
}
