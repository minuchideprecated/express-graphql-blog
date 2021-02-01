import { AuthenticationError } from 'apollo-server-express';
import { MiddlewareFn } from 'type-graphql/dist/interfaces/Middleware';
import { Context } from '../types/context';
import { verifyAccessToken } from '../utils/jwt';

export const isAuth: MiddlewareFn<Context> = ({ context }, next) => {
  const { authorization } = context.req.headers;
  if (!authorization) {
    throw new AuthenticationError('needToken');
  }

  try {
    const token = authorization.split(' ')[1];
    const payload = verifyAccessToken(token);
    context.payload = payload as any;
  } catch (err) {
    console.log(err);
    throw new AuthenticationError('invalidToken');
  }
  return next();
};
