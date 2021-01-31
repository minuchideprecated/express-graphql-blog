import { ConnectionOptions, createConnection } from 'typeorm';
import { NodeEnv } from './config';

interface DatabaseConfig {
  databaseUrl: string;
  nodeEnv: NodeEnv;
}

export const getConnectionOptions = ({ databaseUrl, nodeEnv }: DatabaseConfig): ConnectionOptions => {
  return {
    type: 'postgres',
    url: databaseUrl,
    synchronize: true,
    logging: nodeEnv === 'local' || nodeEnv === 'development',
    dropSchema: nodeEnv === 'test',
    entities: ['entities/**/*.ts', 'entities/**/*.js'],
  };
};

export const createConn = (connectionOptions: ConnectionOptions) => {
  return createConnection(connectionOptions);
};
