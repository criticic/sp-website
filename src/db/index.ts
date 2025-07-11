import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const isProduction = process.env.DATABASE_ENV === 'production' || process.env.NODE_ENV === 'production';

const client = createClient({
  url: isProduction 
    ? process.env.TURSO_DB_REMOTE_URL! 
    : process.env.TURSO_DB_LOCAL_URL || 'http://127.0.0.1:8080',
  authToken: isProduction ? process.env.TURSO_DB_APP_TOKEN : undefined,
});

export const db = drizzle(client, { schema });
