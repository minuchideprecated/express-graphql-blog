import dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(__dirname, '../.env') });

export type NodeEnv = 'local' | 'development' | 'production' | 'test';

export interface Env {
  PORT: string;
  NODE_ENV: NodeEnv;
  DATABASE_URL: string;
  TEST_DATABASE_URL?: string;
}

const ENV = (process.env as unknown) as Env;

export const config = {
  port: ENV.PORT || 4000,
  nodeEnv: ENV.NODE_ENV || 'local',
  databaseUrl: ENV.DATABASE_URL,
  testDatabaseUrl: ENV.TEST_DATABASE_URL,
};
