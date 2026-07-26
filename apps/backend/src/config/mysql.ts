import { logger } from '../utils/logger';

// This file is kept for backward compatibility but is now a no-op
// The application now uses PostgreSQL (Supabase) via Prisma exclusively

export async function initializeMysql(): Promise<void> {
  try {
    logger.info('✅ Using PostgreSQL (Supabase) - MySQL adapter not needed');
  } catch (error) {
    logger.error('❌ Failed to initialize database:', error);
  }
}

export function getMysqlPool(): any {
  logger.warn('⚠️ getMysqlPool called but MySQL is no longer used - use Prisma client instead');
  return null;
}
