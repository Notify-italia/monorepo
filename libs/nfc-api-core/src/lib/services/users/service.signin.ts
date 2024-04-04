import { EnumNotifyUserType, INotifyUser } from '@notify/interfaces';
import { wLog } from '..';
import { BadRequestError } from '../../errors';
import { signToken } from '../service.jwt';
import { Password } from './service.password';
import { genericUserQuery } from './service.query';

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
  userType: EnumNotifyUserType,
  populate = ''
): Promise<INotifyUser> => {
  //queries the database for a user with the provided email
  const user = await genericUserQuery<true>(
    userType,
    { email: provided.email },
    true
  );

  if (!user) {
    wLog('utente non trovato', 'error');
    //if the user is not found, it will throw an error
    return _throwError();
  }

  if (!(await _comparePassword(user.password as string, provided.password))) {
    wLog('password non corrispondente', 'error');
    //if the password does not match, it will throw an error
    return _throwError();
  }

  if (userType === EnumNotifyUserType.Agent && !user.enabled) {
    wLog('utente non attivo', 'error');
    return _throwError();
  }

  if (populate?.length) {
    wLog('populating', 'info');
    await user.populate(populate);
  }

  //if the authentication is successful, it will return the user object with a signed token
  return {
    ...user.toObject(),
    token: signToken({ ...user.toObject(), userType }),
    userType,
  };
};

/**
 * The function refreshToken takes a user object and returns a new token along with the user's
 * information.
 * @param {INotifyUser} u - INotifyUser - an interface representing a user object with properties like
 * userType and _id.
 * @returns an object that includes the user data, a token, and the user type.
 */
export const refreshToken = async (u: INotifyUser, populate = '') => {
  const user = await genericUserQuery<true>(u.userType, { _id: u._id }, true);

  if (!user) {
    return new BadRequestError('Credenziali errate');
  }

  if (populate?.length) {
    await user.populate(populate);
  }

  return {
    ...user.toObject(),
    token: signToken({ ...user.toObject(), userType: u.userType }),
    userType: u.userType,
  };
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

const _throwError = () => {
  throw new BadRequestError('Credenziali errate');
};
