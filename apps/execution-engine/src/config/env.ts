import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('8001'),
  API_KEY: z.string().min(10),

  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().transform(Number).default('6379'),
  REDIS_PASSWORD: z.string().optional(),

  // Resource Limits
  DEFAULT_CPU_TIME_LIMIT: z.string().transform(Number).default('5'),
  DEFAULT_MEMORY_LIMIT: z.string().transform(Number).default('256'),
  DEFAULT_MAX_PROCESSES: z.string().transform(Number).default('20'),
  DEFAULT_MAX_FILE_SIZE: z.string().transform(Number).default('10'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('60000'), // 1 minute
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'), // 100 requests per minute

  // Docker
  DOCKER_SOCKET_PATH: z.string().default('/var/run/docker.sock'),
  DOCKER_NETWORK: z.string().default('execution-network'),
  AUTO_CLEANUP: z.string().transform(v => v === 'true').default('true'),
  CLEANUP_INTERVAL: z.string().transform(Number).default('300000'),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_FILE_PATH: z.string().default('logs/execution-engine.log'),
  LOG_FILE_ENABLED: z.string().transform(v => v === 'true').default('true'),

  // CORS
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),

  // Backend API
  BACKEND_API_URL: z.string().url(),
  BACKEND_API_KEY: z.string().min(10),
});

export const env = envSchema.parse(process.env);
