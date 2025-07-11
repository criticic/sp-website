import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.DATABASE_ENV === 'production' || process.env.NODE_ENV === 'production';

console.log('Using database URL:', isProduction 
  ? process.env.TURSO_DB_REMOTE_URL
  : process.env.TURSO_DB_LOCAL_URL || 'http://127.0.1:8080');

console.log('Database environment:', isProduction ? 'Production' : 'Development');

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: isProduction 
      ? process.env.TURSO_DB_REMOTE_URL! 
      : process.env.TURSO_DB_LOCAL_URL || 'http://127.0.0.1:8080',
    authToken: isProduction ? process.env.TURSO_DB_APP_TOKEN : undefined,
  },
  verbose: true,
  strict: true,
});
