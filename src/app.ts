import { ApolloServer } from 'apollo-server-express';
import compression from 'compression';
import express from 'express';
import morgan from 'morgan';
import 'reflect-metadata';
import { buildSchemaSync, Query, Resolver } from 'type-graphql';
import { config } from './config';

const { port: PORT, env: ENVIRONMENT } = config;
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

export const createServer = () => {
  const app = express();

  const schema = buildSchemaSync({
    resolvers: [GreetResolver],
  });

  const server = new ApolloServer({ schema, playground: ENVIRONMENT !== 'production' });

  server.applyMiddleware({ app, path: PATH });

  return { app, server };
};

export const runServer = (app: express.Express) => {
  const logType = ENVIRONMENT === 'production' ? 'common' : 'dev';

  app.use(morgan(logType));
  app.use(compression());

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${PATH}`);
  });
};
