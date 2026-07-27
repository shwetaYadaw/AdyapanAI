import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { connectRedis } from './config/redis';
import { DockerService } from './services/docker.service';
import Docker from 'dockerode';

const PORT = env.PORT;

async function bootstrap() {
  try {
    // Check Docker availability
    logger.info('Checking Docker availability...');
    const docker = new Docker({ socketPath: env.DOCKER_SOCKET_PATH });
    await docker.ping();
    logger.info('✅ Docker is available');

    // Connect to Redis
    logger.info('Connecting to Redis...');
    await connectRedis();

    // Initialize Docker service and check images
    logger.info('Initializing Docker service...');
    const dockerService = new DockerService();
    
    // Start periodic cleanup
    if (env.AUTO_CLEANUP) {
      setInterval(() => {
        dockerService.cleanupOrphanedContainers().catch(err => {
          logger.error('Cleanup failed:', err);
        });
      }, env.CLEANUP_INTERVAL);
      logger.info(`✅ Auto cleanup enabled (interval: ${env.CLEANUP_INTERVAL}ms)`);
    }

    // Create Express app
    const app = createApp();

    // Start server
    const server = app.listen(PORT, () => {
      logger.info(`
╔═══════════════════════════════════════════════╗
║     ADYAPAN EXECUTION ENGINE                  ║
║  Environment : ${env.NODE_ENV.padEnd(28)}║
║  Port        : ${String(PORT).padEnd(28)}║
║  URL         : http://localhost:${String(PORT).padEnd(15)}║
║  Docker      : Connected                       ║
║  Redis       : Connected                       ║
╚═══════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);
      
      server.close(async () => {
        logger.info('HTTP server closed');
        
        // Cleanup
        try {
          await dockerService.cleanupOrphanedContainers();
          logger.info('Docker cleanup completed');
        } catch (error) {
          logger.error('Docker cleanup failed:', error);
        }

        logger.info('Server shut down gracefully');
        process.exit(0);
      });

      // Force shutdown after timeout
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
