require('dotenv').config();
interface Env {
  PORT: string;
  NODE_ENV: 'local' | 'development' | 'production';
}

const ENV = (process.env as unknown) as Env;

export const config = {
  port: ENV.PORT || 4000,
  env: ENV.NODE_ENV || 'local',
};
