import { createApp } from './app';
import { connectRedis } from './config/redis';
import { env } from './config/env';
import { logger } from './utils/logger';
import { prisma } from './config/prisma';
import { autoSeedQuestions } from './utils/autoSeed';

const PORT = env.PORT;

async function bootstrap() {
  try {
    // Verify MySQL connection via Prisma (with timeout)
    try {
      await Promise.race([
        prisma.$connect(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('DB connection timeout')), 3000)
        )
      ]);
      logger.info('✅ MySQL (Prisma) connected successfully');
    } catch (dbError) {
      logger.warn('⚠️  Database connection failed, continuing without database');
      logger.warn(`Reason: ${dbError}`);
    }

    // Connect to Redis (optional — app works without it)
    try {
      await connectRedis();
    } catch (redisError) {
      logger.warn('⚠️  Redis connection failed, app will work without caching');
    }

    // Initialize MySQL tables/extensions if needed (skip if DB unavailable)
    try {
      const { initializeMysql } = await import('./config/mysql');
      await initializeMysql();
    } catch (initError) {
      logger.warn('⚠️  MySQL initialization failed, skipping');
    }

    // Auto-seed questions from JSON files
    try {
      await autoSeedQuestions();
    } catch (seedError) {
      logger.warn('⚠️  Auto-seed questions failed, skipping');
    }

    // Create Express app
    const app = createApp();

    // Start server
    const server = app.listen(PORT, () => {
      logger.info(`
╔═══════════════════════════════════════════════╗
║          ADYAPAN API Server                   ║
║  Environment : ${env.NODE_ENV.padEnd(28)}║
║  Port        : ${String(PORT).padEnd(28)}║
║  URL         : http://localhost:${String(PORT).padEnd(15)}║
║  Database    : MySQL only (Prisma)             ║
╚═══════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);
      server.close(async () => {
        await prisma.$disconnect();
        logger.info('Server shut down gracefully');
        process.exit(0);
      });

      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Rejection:', reason);
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
