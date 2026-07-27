import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import 'express-async-errors';

import { env } from './config/env';
import { logger } from './config/logger';
import { authenticateApiKey } from './middleware/auth.middleware';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.middleware';
import { executionLimiter, submissionLimiter } from './middleware/rateLimiter.middleware';

import executeRoutes from './routes/execute.routes';
import healthRoutes from './routes/health.routes';

export function createApp(): Application {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: env.ALLOWED_ORIGINS.split(','),
    credentials: true,
  }));

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Compression
  app.use(compression());

  // Logging
  if (env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined', {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    }));
  }

  // Health routes (no auth required)
  app.use('/health', healthRoutes);

  // API routes (auth required)
  app.use('/api/execute', authenticateApiKey, executionLimiter, executeRoutes);
  
  // Apply rate limiter to submit endpoint
  app.post('/api/execute/submit', submissionLimiter);

  // 404 handler
  app.use(notFoundHandler);

  // Error handler
  app.use(errorHandler);

  return app;
}
