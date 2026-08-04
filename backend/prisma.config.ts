import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Use DIRECT_URL (port 5432, session mode) for migrations — Supabase's
    // transaction pooler (port 6543) hangs on advisory locks used by migrate.
    // Falls back to DATABASE_URL if DIRECT_URL is not set.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? '',
  },
});
