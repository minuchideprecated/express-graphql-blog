import { createServer, runServer } from './app';
import { config } from './config';
import { getConnectionOptions } from './ormConfig';

const { databaseUrl, nodeEnv, port } = config;

const start = async () => {
  const production = nodeEnv === 'production';
  const connectionOptions = getConnectionOptions({
    databaseUrl,
    nodeEnv,
  });

  const { app } = await createServer({ connectionOptions, production });

  runServer({ app, port, production });
};

start();
