import { ApolloServer } from 'apollo-server-express';
import compression from 'compression';
import express from 'express';
import morgan from 'morgan';
import 'reflect-metadata';
import { buildSchemaSync, Query, Resolver } from 'type-graphql';
import { ConnectionOptions } from 'typeorm';
import { NodeEnv } from './config';
import { createConn } from './ormConfig';
import { UserResolver } from './resolvers/userResolver';

@Resolver()
export class GreetResolver {
  @Query(() => String)
  sayHello() {
    return 'Hello 👋';
  }

  @Query(() => String)
  sayGoodBye() {
    return 'Good Bye 👋';
  }
}

interface ServerConfig {
  connectionOptions: ConnectionOptions;
  nodeEnv: NodeEnv;
  path: string;
}

interface StartServerConfig {
  app: express.Express;
  port: string | number;
  path: string;
}

export const createApolloServer = (production: boolean) => {
  const schema = buildSchemaSync({
    resolvers: [GreetResolver, UserResolver],
  });

  const server = new ApolloServer({ schema, playground: !production, context: ({ req, res }) => ({ req, res }) });

  return server;
};

export const createServer = async ({ connectionOptions, nodeEnv, path }: ServerConfig) => {
  const app = express();
  const production = nodeEnv === 'production';
  const logType = production ? 'common' : 'dev';

  if (nodeEnv !== 'test') {
    app.use(morgan(logType));
  }
  app.use(compression());

  const connection = await createConn(connectionOptions);

  const server = createApolloServer(production);
  server.applyMiddleware({ app, path });

  return { app, server, connection };
};

export const runServer = ({ app, port, path }: StartServerConfig) => {
  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}${path}`);
  });
};
