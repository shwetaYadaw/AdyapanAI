import { defineConfig } from 'prisma/config';
import 'dotenv/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // DIRECT_URL (port 5432 session mode) is required for migrations with Supabase.
    // The transaction pooler (port 6543) causes hangs due to advisory lock issues.
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || '',
  },
});
