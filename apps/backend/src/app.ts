import 'express-async-errors';
import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { env } from './config/env';
import { globalRateLimiter } from './middleware/rateLimiter.middleware';
import { globalErrorHandler, notFoundHandler } from './middleware/errorHandler.middleware';
import { logger } from './utils/logger';

// Route imports
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import courseRoutes from './routes/course.routes';
import enrollmentRoutes from './routes/enrollment.routes';
import paymentRoutes from './routes/payment.routes';
import certificateRoutes from './routes/certificate.routes';
import jobRoutes from './routes/job.routes';
import mentorRoutes from './routes/mentor.routes';
import forumRoutes from './routes/forum.routes';
import resumeRoutes from './routes/resume.routes';
import aiRoutes from './routes/ai.routes';
import adminRoutes from './routes/admin.routes';
import notificationRoutes from './routes/notification.routes';
import uploadRoutes from './routes/upload.routes';
import healthRoutes from './routes/health.routes';
import placementRoutes from './routes/placement.routes';
import studentRoutes from './routes/student.routes';
import challengeRoutes from './routes/challenge.routes';
import roadmapRoutes from './routes/roadmap.routes';
import problemRoutes from './routes/problem.routes';
import submissionRoutes from './routes/submission.routes';
import puzzleRoutes from './routes/puzzle.routes';

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
  app.use('/api/v1/payments/webhook/stripe', express.raw({ type: 'application/json' }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

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

  // Routes
  app.use('/api/v1/health', healthRoutes);
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/students', studentRoutes);
  app.use('/api/v1/courses', courseRoutes);
  app.use('/api/v1/enrollments', enrollmentRoutes);
  app.use('/api/v1/payments', paymentRoutes);
  app.use('/api/v1/certificates', certificateRoutes);
  app.use('/api/v1/jobs', jobRoutes);
  app.use('/api/v1/mentors', mentorRoutes);
  app.use('/api/v1/forum', forumRoutes);
  app.use('/api/v1/resume', resumeRoutes);
  app.use('/api/v1/placement', placementRoutes);
  app.use('/api/v1/ai', aiRoutes);
  app.use('/api/v1/admin', adminRoutes);
  app.use('/api/v1/challenges', challengeRoutes);
  app.use('/api/v1/problems', problemRoutes);
  app.use('/api/v1/submissions', submissionRoutes);
  app.use('/api/v1/puzzles', puzzleRoutes);
  app.use('/api/v1/roadmap', roadmapRoutes);
  app.use('/api/v1/notifications', notificationRoutes);
  app.use('/api/v1/upload', uploadRoutes);

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler
  app.use(globalErrorHandler);

  return app;
}
