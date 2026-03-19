import rateLimit from 'express-rate-limit';
import type { RequestHandler } from 'express';

const isDev = process.env.NODE_ENV !== 'production';

const noop: RequestHandler = (_req, _res, next) => next();

export const publicLimiter: RequestHandler = isDev
  ? noop
  : rateLimit({
      windowMs: 60 * 1000,
      max: 60,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
    });

export const loginLimiter: RequestHandler = isDev
  ? noop
  : rateLimit({
      windowMs: 60 * 1000,
      max: 5,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: { code: 'RATE_LIMITED', message: 'Too many login attempts' } },
    });

export const analyticsLimiter: RequestHandler = isDev
  ? noop
  : rateLimit({
      windowMs: 60 * 1000,
      max: 120,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: { code: 'RATE_LIMITED', message: 'Too many events' } },
    });
