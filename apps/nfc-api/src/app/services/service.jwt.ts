import jwt from 'jsonwebtoken';
import { BadRequestError } from './errors/errors';
import { declareEnvs } from './service.envs';

const { JWT_KEY } = declareEnvs(['JWT_KEY']);

export const INVALID_JWT_TOKEN =
  'Errore durante la validazione del token. Riprova.';

/**
 * The function `_signToken` takes a user object and returns a signed JSON Web Token (JWT) using the
 * user's id, email, password, and a secret key.
 * @param {Agent} user - The `user` parameter is an object of type `Agent`. It contains properties such
 * as `_id`, `email`, and `password`.
 * @returns a JSON Web Token (JWT) that is signed with the user's ID, email, and password, using the
 * JWT_KEY from the environment variables.
 */
export const signToken = (data: string | object | Buffer, expiresIn = '1d') => {
  return jwt.sign(data, JWT_KEY, {
    expiresIn,
  });
};

export const verifyToken = <T>(token: string, throwError = true) => {
  const verified = jwt.verify(token, JWT_KEY);

  if (!verified && throwError) {
    throw new BadRequestError(INVALID_JWT_TOKEN);
  }

  return jwt.decode(token) as T;
};
