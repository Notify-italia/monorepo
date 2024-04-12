import { EnumNotifyUserType } from '@notify/interfaces';
import * as Sentry from '@sentry/bun';
import { NextFunction, Request, Response } from 'express';
import { permittedRoles, requireAuth, validateRequest } from '.';
import { CustomError } from '../errors';
import { mLog } from '../services';
import { requireApiKey } from './middleware.require-api-key';

//express middleware
export const requestHandler = <T>(
  func: (req: Request<T>, res: Response) => Promise<void>,
  config?: {
    errorMessage?: string;
    requireApiKey?: boolean;
    requireAuth?: {
      requireLicense?: boolean;
      ignoreTokenExpiration?: boolean;
    };
    permittedRoles?: EnumNotifyUserType[];
  }
) => {
  //if requireAuth is true, then we need to check for the token
  const _reqAuth = _loadMiddleware(
    requireAuth(
      config?.requireAuth?.requireLicense,
      config?.requireAuth?.ignoreTokenExpiration
    ),
    !!config?.requireAuth
  );

  const _permRoles = _loadMiddleware(
    permittedRoles(config?.permittedRoles || []),
    !!config?.permittedRoles
  );

  const _reqApiKey = _loadMiddleware(requireApiKey(), config?.requireApiKey);

  return [
    ..._reqApiKey,
    ..._reqAuth,
    ..._permRoles,
    validateRequest,
    _ehReq(func),
  ];
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
      mLog(err.message, 'error');

      if (Sentry.isInitialized()) {
        Sentry.captureException(err);
      }

      res.status(err.statusCode || 400).send({
        errors: [{ message: config?.errorMessage || String(err.message) }],
      });
    });
  };
};

const _loadMiddleware = <T>(
  middleware: (
    req: Request<T>,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>,
  condition: boolean | undefined
) => {
  if (!condition) {
    return [];
  }

  return [_ehReq(middleware)];
};
