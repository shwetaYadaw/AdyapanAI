import 'express-async-errors';
import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';

import { env } from './config/env';
import { globalRateLimiter } from './middleware/rateLimiter.middleware';
import { globalErrorHandler, notFoundHandler } from './middleware/errorHandler.middleware';
import { logger } from './utils/logger';

// Route imports - Core Features Only
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import studentRoutes from './routes/student.routes';
import adminRoutes from './routes/admin.routes';
import problemRoutes from './routes/problem.routes';
import problemAdminRoutes from './routes/problem-admin.routes';
import tcsNqtAdminRoutes from './routes/tcs-nqt-admin.routes';
import tcsNqtRoutes from './routes/tcs-nqt.routes';
import questionsAdminRoutes from './routes/questions-admin.routes';
import topicAdminRoutes from './routes/topic-admin.routes';
import submissionRoutes from './routes/submission.routes';
import problemSubmissionRoutes from './routes/problemSubmission.routes';
import questionSubmissionRoutes from './routes/questionSubmission.routes';
import contestRoutes from './routes/contest.routes';
import aptitudeRoutes from './routes/aptitude.routes';
import notificationRoutes from './routes/notification.routes';
import uploadRoutes from './routes/upload.routes';
import healthRoutes from './routes/health.routes';

export function createApp(): Application {
  const app = express();

  // Security headers
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: env.isProduction(),
    })
  );

  // CORS
  const allowedOrigins = [
    env.CLIENT_URL,
    env.MOBILE_URL,
    'https://adyapan.com',
    'https://www.adyapan.com',
  ].filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Body parsing
  // Webhooks need raw body — must be before express.json()
  // (Removed payment webhooks - not needed)
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // Static files - Images
  app.use('/images', express.static(path.join(__dirname, '../public/images')));

  // Compression
  app.use(compression() as any);

  // HTTP request logging
  if (env.isDevelopment()) {
    app.use(morgan('dev'));
  } else {
    app.use(
      morgan('combined', {
        stream: { write: (message) => logger.info(message.trim()) },
      })
    );
  }

  // Global rate limiter
  app.use('/api/', globalRateLimiter);

  // Routes - Core Features Only
  app.use('/api/v1/health', healthRoutes);
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/students', studentRoutes);
  
  // Admin routes
  app.use('/api/v1/admin', adminRoutes);
  app.use('/api/v1/admin/tcs-nqt', tcsNqtAdminRoutes);
  app.use('/api/v1/admin/questions', questionsAdminRoutes);
  app.use('/api/v1/admin/problems', problemAdminRoutes);
  app.use('/api/v1/admin/topics', topicAdminRoutes);
  
  // Problem & Submission routes
  app.use('/api/v1/problems', problemRoutes);
  app.use('/api/v1/submissions', submissionRoutes); // Legacy
  app.use('/api/v1/problem-submissions', problemSubmissionRoutes); // Coding Arena
  app.use('/api/v1/question-submissions', questionSubmissionRoutes); // TCS NQT
  app.use('/api/v1/tcs-nqt', tcsNqtRoutes); // TCS NQT student-facing routes
  
  // Practice & Tests
  app.use('/api/v1/contests', contestRoutes);
  app.use('/api/v1/aptitude', aptitudeRoutes);
  
  // Utilities
  app.use('/api/v1/notifications', notificationRoutes);
  app.use('/api/v1/upload', uploadRoutes);

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler
  app.use(globalErrorHandler);

  return app;
}
