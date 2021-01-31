import { ApolloServer } from 'apollo-server-express';
import compression from 'compression';
import express from 'express';
import morgan from 'morgan';
import 'reflect-metadata';
import { buildSchemaSync, Query, Resolver } from 'type-graphql';
import { ConnectionOptions } from 'typeorm';
import { createConn } from './ormConfig';
import { UserResolver } from './resolvers/userResolver';

const PATH = '/graphql';

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
  production: boolean;
}

interface StartServerConfig {
  app: express.Express;
  port: string | number;
  production: boolean;
}

export const createApolloServer = (production: boolean) => {
  const schema = buildSchemaSync({
    resolvers: [GreetResolver, UserResolver],
  });

  const server = new ApolloServer({ schema, playground: !production });

  return server;
};

export const createServer = async ({ connectionOptions, production }: ServerConfig) => {
  const app = express();

  const connection = await createConn(connectionOptions);

  const server = createApolloServer(production);
  server.applyMiddleware({ app, path: PATH });

  return { app, server, connection };
};

export const runServer = ({ app, port, production }: StartServerConfig) => {
  const logType = production ? 'common' : 'dev';

  app.use(morgan(logType));
  app.use(compression());

  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}${PATH}`);
  });
};
