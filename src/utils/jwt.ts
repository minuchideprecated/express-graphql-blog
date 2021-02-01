import { sign, verify } from 'jsonwebtoken';
import { config } from '../config';

const accessTokenSecret = config.accessTokenSecret;

if (!accessTokenSecret) {
  throw new Error('No JWT Access Token Secret');
}

export const createAccessToken = (id: number): string => {
  const token = sign(
    {
      userId: id,
    },
    accessTokenSecret,
    {
      expiresIn: '15m',
    },
  );
  return token;
};

export const verifyAccessToken = (token: string) => {
  return verify(token, accessTokenSecret);
};
