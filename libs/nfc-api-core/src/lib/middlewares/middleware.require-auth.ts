import { EnumNotifyUserType, INotifyUser } from '@notify/interfaces';
import { CompanyModel } from '@notify/nfc-api-core';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify as JwtVerify, VerifyErrors } from 'jsonwebtoken';
import { NotAuthorizedError } from '../../../../../apps/nfc-api/src/app/services/errors/errors';
import { declareEnvs } from '../../../../../apps/nfc-api/src/app/services/service.envs';
import { LicenseManager } from '../../../../../apps/nfc-api/src/app/services/service.license';
import { wLog } from '../../../../../apps/nfc-api/src/main';

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
  secret: string,
  ignoreExpiration: boolean
): Promise<string | JwtPayload | undefined | VerifyErrors> => {
  return new Promise((resolve, reject) => {
    JwtVerify(
      token,
      secret,
      {
        ignoreExpiration,
      },
      (error, decode) => {
        if (error) {
          wLog(error.message, 'error');
          return reject(error);
        }

        // Logger.info(decode);
        return resolve(decode);
      }
    );
  });
};

export const requireAuth = <T>(
  requireLicense = false,
  ignoreExpiration = false
) => {
  return async (req: Request<T>, res: Response, next: NextFunction) => {
    if (!requireLicense) {
      return _requireAuth(req, ignoreExpiration).then(() => next());
    }

    const isActive =
      (await _requireAuth(req, ignoreExpiration)) &&
      (await _hasActiveLicense(req.currentUser));

    if (!isActive) {
      throw new NotAuthorizedError();
    }

    next();
  };
};

export const injectAuth = async <T>(
  req: Request<T>,
  ignoreExpiration = false
) => {
  const token = req.header('Authorization')?.replace('Bearer ', '') || null;

  if (!token || token === 'null') {
    //a check for 'token === null' is needed because of the way the token is passed in the header
    return null;
  }

  const payload = (await verifyJwt(token, JWT_KEY, ignoreExpiration).catch(
    (error) => {
      if (error && error.name === 'TokenExpiredError') {
        wLog(error.message, 'error');
        return null;
      }

      wLog(error.message, 'error');
      return null;
    }
  )) as INotifyUser;

  req.currentUser = payload;

  return payload;
};

const _requireAuth = async <T>(req: Request<T>, ignoreExpiration: boolean) => {
  const payload = await injectAuth(req, ignoreExpiration);

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

  return true;
};

const _hasActiveLicense = async (user: INotifyUser): Promise<boolean> => {
  //obtains the current license directly from the user (assuming it's a company) or through _getAgentLicense
  const lm = await LicenseManager.load({ id: user.license }).catch(
    async () => await _getAgentLicense(user)
  );

  if (!lm || !lm.license.enabled) {
    return false;
  }

  if (!lm.license.expirationDate) {
    return true;
  }

  return new Date(lm.license.expirationDate) > new Date();
};

/**
 * Obtains the license of the agent's company
 */
const _getAgentLicense = async (user: INotifyUser) => {
  const company = await CompanyModel.findById(user.owner);

  if (!company) {
    wLog('User has no company', 'warning');
    return null;
  }

  return LicenseManager.load({ id: String(company.license) });
};
