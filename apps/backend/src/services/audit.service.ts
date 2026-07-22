import { prisma } from '../config/prisma';
import { logger } from '../utils/logger';

export class AuditService {
  static async log(data: {
    userId?: string;
    action: string;
    resource?: string;
    resourceId?: string;
    changes?: unknown;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          userId: data.userId,
          action: data.action,
          resource: data.resource,
          resourceId: data.resourceId,
          changes: data.changes as any,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        },
      });
    } catch (err) {
      // Audit failures should not break business logic
      logger.warn('AuditLog write failed:', err);
    }
  }
}
