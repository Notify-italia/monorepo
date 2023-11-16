import { NextFunction, Request, Response } from 'express';
import { wLog } from '../../../../main';
import { requireAuth } from '../../../middlewares/middleware.require-auth';
import { validateRequest } from '../../../middlewares/middleware.validate-request';
import { CustomError } from '../errors';
//express middleware
export const errorHandledRequest = <T>(
  func: (req: Request<T>, res: Response) => Promise<void>,
  config?: { errorMessage?: string; requireAuth?: boolean }
) => {
  //if requireAuth is true, then we need to check for the token
  const reqAuth = config?.requireAuth ? [_ehReq(requireAuth)] : [];

  return [validateRequest, ...reqAuth, _ehReq(func)];
};

const _ehReq = <T>(
  func: (req: Request<T>, res: Response, next: NextFunction) => Promise<void>,
  config?: { errorMessage?: string; requireAuth?: boolean }
) => {
  return async (req: Request<T>, res: Response, next: NextFunction) => {
    await func(req, res, next).catch((err: CustomError) => {
      wLog(err.message, 'error');
      res
        .status(err.statusCode || 400)
        .send({ errors: [{ message: config?.errorMessage || String(err) }] });
    });
  };
};
