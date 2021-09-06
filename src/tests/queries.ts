import { gql } from 'apollo-server-express';

export const SAY_HELLO = gql`
  query {
    sayHello
  }
`;

export const SAY_GOOD_BYE = gql`
  query {
    sayGoodBye
  }
`;
