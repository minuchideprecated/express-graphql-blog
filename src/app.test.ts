import { gql } from 'apollo-server-express';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';
import { Connection } from 'typeorm';
import { createServer } from './app';
import { config } from './config';
import { getConnectionOptions } from './ormConfig';

const { testDatabaseUrl } = config;

if (!testDatabaseUrl) {
  throw Error('No Test Database!');
}

const connectionOptions = getConnectionOptions({
  databaseUrl: testDatabaseUrl,
  nodeEnv: 'test',
});

let dbConnection: Connection;
let query: ApolloServerTestClient['query'];
let mutate: ApolloServerTestClient['mutate'];
beforeAll(async () => {
  const { server, connection } = await createServer({
    production: false,
    connectionOptions,
  });

  const client = createTestClient(server);
  query = client.query;
  mutate = client.mutate;

  dbConnection = connection;
});

afterAll(async () => {
  await dbConnection.close();
});

test('SayHello', async () => {
  const SAY_HELLO = gql`
    query {
      sayHello
    }
  `;

  const {
    data: { sayHello },
  } = await query({ query: SAY_HELLO });

  expect(sayHello).toEqual('Hello 👋');
});

test('SayGoodBye', async () => {
  const SAY_GOOD_BYE = gql`
    query {
      sayGoodBye
    }
  `;

  const {
    data: { sayGoodBye },
  } = await query({ query: SAY_GOOD_BYE });

  expect(sayGoodBye).toEqual('Good Bye 👋');
});

describe('createUser', () => {
  const create = async (mutation: any) => {
    const {
      data: { createUser },
    } = await mutate({
      mutation,
    });

    return createUser;
  };

  test('should be true without nickname', async () => {
    const CREATE_USER = gql`
      mutation {
        createUser(data: { email: "nonickname@test.com", password: "password1234!" })
      }
    `;

    const createUser = await create(CREATE_USER);

    expect(createUser).toBeTruthy();
  });

  test('should be true with nickname', async () => {
    const CREATE_USER = gql`
      mutation {
        createUser(data: { email: "nickname@test.com", password: "password1234!", nickname: "test machine" })
      }
    `;

    const createUser = await create(CREATE_USER);

    expect(createUser).toBeTruthy();
  });

  test('should return an error if email is invalid', async () => {
    const CREATE_USER = gql`
      mutation {
        createUser(data: { email: "test.com", password: "pass" })
      }
    `;

    const { errors } = await mutate({
      mutation: CREATE_USER,
    });

    const validationErrors = (errors as any)[0].extensions.exception.validationErrors;
    const error = validationErrors.find((x: any) => x.constraints.isEmail != null).constraints.isEmail;

    expect(error).toBe('email must be an email');
  });

  test('should return an error if password is invalid', async () => {
    const CREATE_USER = gql`
      mutation {
        createUser(data: { email: "pass@test.com", password: "pass" })
      }
    `;

    const { errors } = await mutate({
      mutation: CREATE_USER,
    });

    const validationErrors = (errors as any)[0].extensions.exception.validationErrors;
    const error = validationErrors.find((x: any) => x.constraints.isLength != null).constraints.isLength;

    expect(error).toBe('password must be longer than or equal to 8 characters');
  });
});
