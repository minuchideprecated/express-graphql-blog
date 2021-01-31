import dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(__dirname, '../.env') });

interface Env {
  PORT: string;
  NODE_ENV: 'local' | 'development' | 'production';
  DATABASE_URL: string;
}

const ENV = (process.env as unknown) as Env;

export const config = {
  port: ENV.PORT || 4000,
  env: ENV.NODE_ENV || 'local',
  databaseUrl: ENV.DATABASE_URL,
};
