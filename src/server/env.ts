import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number().default(3012),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  ADMIN_PASSWORD_HASH: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  KICK_CHANNEL_SLUG: z.string().default('wizardjiocb'),
  KICK_CLIENT_ID: z.string().optional(),
  KICK_CLIENT_SECRET: z.string().optional(),
  KICK_REDIRECT_URI: z.string().optional(),
  KICK_WEBHOOK_SECRET: z.string().optional(),
  SITE_URL: z.string().default('http://localhost:5173'),
});

export type Env = z.infer<typeof envSchema>;

let _env: Env | null = null;

export function loadEnv(): Env {
  if (_env) return _env;
  _env = envSchema.parse(process.env);
  return _env;
}

export function getEnv(): Env {
  if (!_env) throw new Error('Env not loaded. Call loadEnv() first.');
  return _env;
}
