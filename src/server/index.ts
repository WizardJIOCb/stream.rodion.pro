import 'dotenv/config';
import { loadEnv, getEnv } from './env.js';
import { createApp } from './app.js';
import { getDb } from './db/connection.js';

// Load and validate environment
loadEnv();
const env = getEnv();

// Initialize database connection
getDb();

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`[stream.rodion.pro] Server running on port ${env.PORT} (${env.NODE_ENV})`);
});
