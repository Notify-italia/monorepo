import {
  EnumNotifyUserType,
  INotifyCompany,
  INotifyUser,
} from '@notify/interfaces';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify as JwtVerify, VerifyErrors } from 'jsonwebtoken';
import { wLog } from '../../main';
import { NotAuthorizedError } from '../services/errors/errors';
import { declareEnvs } from '../services/service.envs';
import { LicenseManager } from '../services/service.license';

const { JWT_KEY } = declareEnvs(['JWT_KEY']);

// Per come funzionano i middleware in Express, si veda:
// http://expressjs.com/en/guide/using-middleware.html#using-middleware

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser: INotifyUser;
    }
  }
}

const verifyJwt = (
  token: string,
  secret: string
): Promise<string | JwtPayload | undefined | VerifyErrors> => {
  return new Promise((resolve, reject) => {
    JwtVerify(token, secret, (error, decode) => {
      if (error) {
        wLog(error.message, 'error');
        return reject(error);
      }

      // Logger.info(decode);
      return resolve(decode);
    });
  });
};

export const requireAuth = <T>(requireLicense = false) => {
  return async (req: Request<T>, res: Response, next: NextFunction) => {
    if (!requireLicense) {
      return _requireAuth(req).then(() => next());
    }

    const isActive =
      (await _requireAuth(req)) && (await _hasActiveLicense(req.currentUser));

    if (!isActive) {
      throw new NotAuthorizedError();
    }

    next();
  };
};

export const injectAuth = async <T>(req: Request<T>) => {
  const token = req.header('Authorization')?.replace('Bearer ', '') || null;

  if (!token || token === 'null') {
    //a check for 'token === null' is needed because of the way the token is passed in the header
    return null;
  }

  const payload = (await verifyJwt(token, JWT_KEY).catch((error) => {
    if (error && error.name === 'TokenExpiredError') {
      wLog(error.message, 'error');
      return null;
    }

    wLog(error.message, 'error');
    return null;
  })) as INotifyUser;

  req.currentUser = payload;

  return payload;
};

const _requireAuth = async <T>(req: Request<T>) => {
  const payload = await injectAuth(req);

  if (!payload) {
    throw new NotAuthorizedError();
  }

  if (!_isAllowed(req.currentUser)) {
    throw new NotAuthorizedError();
  }

  return true;
};

const _isAllowed = (user: INotifyUser): boolean => {
  if (!user) {
    return false;
  }

  if (user.userType === EnumNotifyUserType.Agent) {
    return user.enabled;
  }

  wLog('User is not an agent', 'warning');

  return true;
};

const _hasActiveLicense = async (user: INotifyCompany): Promise<boolean> => {
  if (!user.license) {
    wLog('User has no license', 'warning');
    return false;
  }

  const lm = await LicenseManager.findWithId(user.license);

  return lm.license.enabled && new Date(lm.license.expirationDate) > new Date();
};
