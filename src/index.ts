import { createServer, runServer } from './app';
import { config } from './config';
import { getConnectionOptions } from './ormConfig';

const { databaseUrl, nodeEnv, port } = config;

const start = async () => {
  const connectionOptions = getConnectionOptions({
    databaseUrl,
    nodeEnv,
  });

  const { app } = await createServer({ connectionOptions, nodeEnv });

  runServer({ app, port });
};

start();
