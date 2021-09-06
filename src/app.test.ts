import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';
import { Connection } from 'typeorm';
import { createServer } from './app';
import { config } from './config';
import User from './entities/User';
import { getConnectionOptions } from './ormConfig';
import * as mutations from './tests/mutations';
import * as queries from './tests/queries';
import { getPostgresUrl } from './utils/db';
import { verifyAccessToken } from './utils/jwt';

if (!config.test) {
  throw Error('There is no configuration in config.json.');
}
const { host, user, password, port, database } = config.test.database;
const testDatabaseUrl = getPostgresUrl({
  host,
  user,
  password,
  port,
  database,
});

const connectionOptions = getConnectionOptions({
  databaseUrl: testDatabaseUrl,
  nodeEnv: 'test',
});

let dbConnection: Connection;
let query: ApolloServerTestClient['query'];
let mutate: ApolloServerTestClient['mutate'];
beforeAll(async () => {
  const { server, connection } = await createServer({
    nodeEnv: 'test',
    connectionOptions,
    path: '/graphql',
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
  const {
    data: { sayHello },
  } = await query({ query: queries.SAY_HELLO });

  expect(sayHello).toEqual('Hello 👋');
});

test('SayGoodBye', async () => {
  const {
    data: { sayGoodBye },
  } = await query({ query: queries.SAY_GOOD_BYE });

  expect(sayGoodBye).toEqual('Good Bye 👋');
});

describe('createUser', () => {
  test('should be true without nickname', async () => {
    const { data } = await mutate({
      mutation: mutations.CREATE_USER,
      variables: {
        email: 'nonickname@test.com',
        password: 'password1234!',
      },
    });

    expect(data.createUser).toBeTruthy();
  });

  test('should be true with nickname', async () => {
    // createUser(data: { email: "nickname@test.com", password: "password1234!", nickname: "test machine" })

    const { data } = await mutate({
      mutation: mutations.CREATE_USER,
      variables: {
        email: 'nickname@test.com',
        password: 'password1234!',
        nickname: 'test machine',
      },
    });

    expect(data.createUser).toBeTruthy();
  });

  test('should return an error if email is invalid', async () => {
    const { errors } = await mutate({
      mutation: mutations.CREATE_USER,
      variables: { email: 'test.com', password: 'pass' },
    });

    const validationErrors = (errors as any)[0].extensions.exception.validationErrors;
    const error = validationErrors.find((x: any) => x.constraints.isEmail != null).constraints.isEmail;

    expect(error).toBe('email must be an email');
  });

  test('should return an error if password is invalid', async () => {
    const { errors } = await mutate({
      mutation: mutations.CREATE_USER,
      variables: { email: 'pass@test.com', password: 'pass' },
    });

    const validationErrors = (errors as any)[0].extensions.exception.validationErrors;
    const error = validationErrors.find((x: any) => x.constraints.isLength != null).constraints.isLength;

    expect(error).toBe('password must be longer than or equal to 8 characters');
  });
});

describe('signIn', () => {
  // test email & password
  const _email = 'test@test.com';
  const _password = 'nicePassword1!';

  beforeAll(async () => {
    await User.create({ email: _email, password: _password }).save();
  });

  afterAll(async () => {
    const user = await User.findOne({ email: _email });
    if (!!user) {
      await user.remove();
    }
  });

  test('should return accessToken', async () => {
    const {
      data: { signIn },
    } = await mutate({
      mutation: mutations.SIGN_IN,
      variables: { email: _email, password: _password },
    });

    const accessToken = signIn.accessToken;

    const accessTokenInfo = verifyAccessToken(accessToken);
    expect(typeof accessTokenInfo).toEqual('object');
  });

  test('should throw invalid password error with unregistered email', async () => {
    const { errors } = await mutate({
      mutation: mutations.SIGN_IN,
      variables: { email: '2ebf31b1-2a05-5b4f-8220-ab6dcef98a90', password: _password },
    });

    const error = errors?.find((error) => error.message === 'invalidPassword');

    expect(error?.message).toEqual('invalidPassword');
  });

  test('should throw invalid password error with invalid password', async () => {
    const { errors } = await mutate({
      mutation: mutations.SIGN_IN,
      variables: { email: _email, password: 'aa1bb587-688d-56a7-bd7a-3669621ea6ee' },
    });

    const error = errors?.find((error) => error.message === 'invalidPassword');

    expect(error?.message).toEqual('invalidPassword');
  });
});
