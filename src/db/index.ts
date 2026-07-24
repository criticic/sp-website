import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const isProduction = process.env.DATABASE_ENV === 'production';

const url = isProduction
  ? process.env.TURSO_DB_REMOTE_URL!
  : process.env.TURSO_DB_LOCAL_URL || 'http://127.0.0.1:8080';

const client = createClient({
  url,
  authToken: process.env.TURSO_DB_APP_TOKEN,
});

export const db = drizzle(client, { schema });
