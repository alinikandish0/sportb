import "dotenv/config";
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  // مسیر پوشه‌ای که Prisma به‌صورت بازگشتی دنبال فایل‌های *.prisma می‌گرده
  schema: './prisma/schema',
  // این url فقط برای Migrate/introspection استفاده میشه (نه برای PrismaClient در runtime)
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrations: {
    path: './prisma/migrations',
    seed: 'ts-node prisma/seed.ts',
  },
});
