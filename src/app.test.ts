import { gql } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';
import { createApolloServer } from './app';

const server = createApolloServer(false);
const { query } = createTestClient(server);

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
