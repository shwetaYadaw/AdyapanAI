import { defineConfig } from '@prisma/internals';

export const defineConfig = (config: any) => config;

export default defineConfig({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || '',
    },
  },
});
