import { EnumNotifyUserType, INotifyUser } from '@notify/nfc-interfaces';
import jwt from 'jsonwebtoken';
import { Agent } from '../../models/model.agent';
import { BadRequestError } from '../errors/errors';
import { Password } from './service.password';
import { UserDocTypes, genericUserQuery } from './service.query';

/**
 * The SigninService function takes in user authentication credentials and a target database, queries
 * the database for a user with the provided email, compares the provided password with the user's
 * stored password, and returns the user if authentication is successful.
 * @param provided - The `auth` parameter is an object that contains the provided email and password.
 * @param {EnumNotifyUserType} userType - The `userType` parameter is an enumeration (`EnumUserType`) that
 * specifies the target database where the query will be executed. It is used to determine which
 * database to query for the user's information.
 * @returns the user object if the authentication is successful. If the user is not found or the
 * password does not match, it will throw an error.
 */
export const signIn = async (
  provided: {
    email: string;
    password: string;
  },
  userType: EnumNotifyUserType
): Promise<INotifyUser> => {
  //queries the database for a user with the provided email
  const user = await genericUserQuery<true>(
    userType,
    { email: provided.email },
    true
  );

  if (!user) {
    //if the user is not found, it will throw an error
    return throwError();
  }

  if (!(await _comparePassword(user.password, provided.password))) {
    //if the password does not match, it will throw an error
    return throwError();
  }

  //if the authentication is successful, it will return the user object with a signed token
  return { ...user.toObject(), token: _signToken(user), userType };
};

/**
 * The function refreshToken takes a user object and returns a new token along with the user's
 * information.
 * @param {INotifyUser} u - INotifyUser - an interface representing a user object with properties like
 * userType and _id.
 * @returns an object that includes the user data, a token, and the user type.
 */
export const refreshToken = async (u: INotifyUser) => {
  const user = await genericUserQuery<true>(u.userType, { _id: u._id }, true);

  if (!user) {
    return new BadRequestError('Credenziali errate');
  }

  return { ...user.toObject(), token: _signToken(user), userType: u.userType };
};

/**
 * The function compares a provided password with a source password using the Password.compare method.
 * @param {string} source - The `source` parameter is a string that represents the original password
 * that needs to be compared.
 * @param {string} provided - The "provided" parameter is a string that represents the password
 * provided by the user.
 * @returns the result of the `Password.compare` method, which is a boolean value indicating
 * whether the provided password matches the source password.
 */
const _comparePassword = async (source: string, provided: string) => {
  return await Password.compare(source, provided);
};

/**
 * The function `_signToken` takes a user object and returns a signed JSON Web Token (JWT) using the
 * user's id, email, password, and a secret key.
 * @param {Agent} user - The `user` parameter is an object of type `Agent`. It contains properties such
 * as `_id`, `email`, and `password`.
 * @returns a JSON Web Token (JWT) that is signed with the user's ID, email, and password, using the
 * JWT_KEY from the environment variables.
 */
const _signToken = (user: UserDocTypes) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      password: user.password,
    },
    Bun.env.JWT_KEY!,
    {
      expiresIn: '1d',
    }
  );
};

const throwError = () => {
  throw new BadRequestError('Credenziali errate');
};
