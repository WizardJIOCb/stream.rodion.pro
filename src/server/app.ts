import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import publicRouter from './routes/public.js';
import adminRouter from './routes/admin.js';
import webhooksRouter from './routes/webhooks.js';
import analyticsRouter from './routes/analytics.js';
import { publicLimiter } from './middleware/rate-limit.js';
import { errorHandler } from './middleware/error-handler.js';
import { getEnv } from './env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();
  const env = getEnv();

  // Middleware
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: env.SITE_URL, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api/public', publicLimiter, publicRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/webhooks', webhooksRouter);
  app.use('/api/analytics', analyticsRouter);

  // Serve frontend in production
  if (env.NODE_ENV === 'production') {
    const frontendDir = path.resolve(__dirname, '../../frontend');
    app.use(express.static(frontendDir, { maxAge: '1y', immutable: true }));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(frontendDir, 'index.html'));
    });
  }

  // Error handler
  app.use(errorHandler);

  return app;
}
