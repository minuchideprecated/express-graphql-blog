import { gql } from 'apollo-server-express';

export const CREATE_USER = gql`
  mutation ($email: String!, $password: String!, $nickname: String) {
    createUser(data: { email: $email, password: $password, nickname: $nickname })
  }
`;

export const SIGN_IN = gql`
  mutation ($email: String!, $password: String!) {
    signIn(data: { email: $email, password: $password }) {
      accessToken
    }
  }
`;
