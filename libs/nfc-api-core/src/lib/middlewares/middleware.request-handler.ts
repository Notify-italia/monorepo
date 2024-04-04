import { EnumNotifyUserType } from '@notify/interfaces';
import * as Sentry from '@sentry/bun';
import { NextFunction, Request, Response } from 'express';
import { permittedRoles, requireAuth, validateRequest } from '.';
import { CustomError } from '../errors';
import { wLog } from '../services';
//express middleware
export const requestHandler = <T>(
  func: (req: Request<T>, res: Response) => Promise<void>,
  config?: {
    errorMessage?: string;
    requireAuth?: {
      requireLicense?: boolean;
      ignoreTokenExpiration?: boolean;
    };
    permittedRoles?: EnumNotifyUserType[];
  }
) => {
  //if requireAuth is true, then we need to check for the token
  const _reqAuth = config?.requireAuth
    ? [
        _ehReq(
          requireAuth(
            config.requireAuth.requireLicense,
            config.requireAuth.ignoreTokenExpiration
          )
        ),
      ]
    : [];

  const _permRoles = config?.permittedRoles?.length
    ? [_ehReq(permittedRoles(config.permittedRoles))]
    : [];

  return [validateRequest, ..._reqAuth, ..._permRoles, _ehReq(func)];
};

const _ehReq = <T>(
  func: (
    req: Request<T>,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>,
  config?: { errorMessage?: string; requireAuth?: boolean }
) => {
  return async (req: Request<T>, res: Response, next: NextFunction) => {
    await func(req, res, next)?.catch((err: CustomError) => {
      wLog(err.message, 'error');

      Sentry.captureException(err);

      res.status(err.statusCode || 400).send({
        errors: [{ message: config?.errorMessage || String(err.message) }],
      });
    });
  };
};
