import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

export type NodeEnv = 'local' | 'development' | 'production' | 'test';

interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  port: string | number;
  database: string;
}

interface Config {
  service: {
    path?: string;
    port: string | number;
    database: DatabaseConfig;
    secret: string;
  };
  test?: {
    database: DatabaseConfig;
  };
}

export const nodeEnv = (process.env.NODE_ENV != null ? process.env.NODE_ENV : 'local') as NodeEnv;

const cfgFileName = `config${nodeEnv === 'test' ? '.test' : ''}.json`;
const cfgPath = resolve(__dirname, `../${cfgFileName}`);
if (!existsSync(cfgPath)) {
  throw new Error('config.json not found.');
}

export const config: Config = JSON.parse(
  readFileSync(cfgPath, {
    encoding: 'utf-8',
  }),
);
