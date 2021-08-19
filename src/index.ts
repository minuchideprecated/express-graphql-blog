import { createServer, runServer } from './app';
import { config, nodeEnv } from './config';
import { getConnectionOptions } from './ormConfig';
import { getPostgresUrl } from './utils/db';

const start = async () => {
  const port = config.service.port;
  const path = config.service.path != null ? config.service.path : '/graphql';
  const { host, user, password, port: pgPort, database } = config.service.database;
  const databaseUrl = getPostgresUrl({
    host,
    user,
    password,
    port: pgPort,
    database,
  });

  console.log(databaseUrl);

  const connectionOptions = getConnectionOptions({
    databaseUrl,
    nodeEnv,
  });

  const { app } = await createServer({ connectionOptions, nodeEnv, path });

  runServer({ app, port, path });
};

start();
