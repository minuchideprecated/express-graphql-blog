import { ConnectionOptions, createConnection } from 'typeorm';

interface DatabaseConfig {
  databaseUrl: string;
  production: boolean;
}

export const getConnectionOptions = ({ databaseUrl, production }: DatabaseConfig): ConnectionOptions => {
  return {
    type: 'postgres',
    url: databaseUrl,
    synchronize: true,
    logging: production,
    entities: ['entities/**/*.ts', 'entities/**/*.js'],
  };
};

export const createConn = (connectionOptions: ConnectionOptions) => {
  return createConnection(connectionOptions);
};
