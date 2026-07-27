import { Router } from 'express';
import { JudgeService } from '../services/judge.service';
import Docker from 'dockerode';
import { env } from '../config/env';
import { redis } from '../config/redis';

const router = Router();
const docker = new Docker({ socketPath: env.DOCKER_SOCKET_PATH });
const judgeService = new JudgeService();

/**
 * GET /health
 * Basic health check
 */
router.get('/', async (req, res) => {
  res.json({
    success: true,
    message: 'Execution Engine is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * GET /health/detailed
 * Detailed health check including Docker and Redis
 */
router.get('/detailed', async (req, res) => {
  const health: any = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {},
  };

  // Check Docker
  try {
    await docker.ping();
    health.services.docker = {
      status: 'healthy',
      message: 'Docker daemon is accessible',
    };
  } catch (error: any) {
    health.status = 'unhealthy';
    health.services.docker = {
      status: 'unhealthy',
      message: error.message || 'Docker daemon is not accessible',
    };
  }

  // Check Redis
  try {
    await redis.ping();
    health.services.redis = {
      status: 'healthy',
      message: 'Redis is connected',
    };
  } catch (error: any) {
    health.status = 'degraded';
    health.services.redis = {
      status: 'unhealthy',
      message: error.message || 'Redis is not connected',
    };
  }

  // Check Judge Service
  try {
    const judgeHealth = await judgeService.getHealthStatus();
    health.services.judge = judgeHealth;
  } catch (error: any) {
    health.status = 'degraded';
    health.services.judge = {
      healthy: false,
      message: error.message || 'Judge service error',
    };
  }

  const statusCode = health.status === 'healthy' ? 200 : 
                     health.status === 'degraded' ? 200 : 503;

  res.status(statusCode).json({
    success: health.status !== 'unhealthy',
    data: health,
  });
});

/**
 * GET /health/docker
 * Check Docker images
 */
router.get('/docker', async (req, res) => {
  try {
    const images = await docker.listImages();
    const adyapanImages = images.filter(img => 
      img.RepoTags?.some(tag => tag.startsWith('adyapan/runner-'))
    );

    res.json({
      success: true,
      data: {
        totalImages: images.length,
        adyapanRunners: adyapanImages.length,
        runners: adyapanImages.map(img => ({
          id: img.Id,
          tags: img.RepoTags,
          size: img.Size,
          created: img.Created,
        })),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to check Docker images',
    });
  }
});

export default router;
