import * as jwt from 'jsonwebtoken';

interface tokenPayload {
  id: number;
}

export const genJWT = (payload: tokenPayload): string => {
  const opts = {
    issuer: process.env.ISSUER,
    audience: process.env.AUDIENCE,
    expiresIn: process.env.EXPIRES,
  };
  const secret = process.env.TOKEN_SECRET;

  return jwt.sign(payload, secret, opts);
};
