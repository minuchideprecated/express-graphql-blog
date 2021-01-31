import { createServer, runServer } from './app';
import { config } from './config';
import { getConnectionOptions } from './ormConfig';

const { databaseUrl, env, port } = config;

const run = async () => {
  const production = env === 'production';
  const connectionOptions = getConnectionOptions({
    databaseUrl,
    production,
  });

  const { app } = await createServer({ connectionOptions, production });

  runServer({ app, port, production });
};

run();
