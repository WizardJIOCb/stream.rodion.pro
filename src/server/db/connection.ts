import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';
import { getEnv } from '../env.js';

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let _pool: pg.Pool | null = null;

export function getDb() {
  if (_db) return _db;
  const env = getEnv();
  _pool = new pg.Pool({ connectionString: env.DATABASE_URL });
  _db = drizzle(_pool, { schema });
  return _db;
}

export function getPool() {
  return _pool;
}

export async function closeDb() {
  if (_pool) {
    await _pool.end();
    _pool = null;
    _db = null;
  }
}
