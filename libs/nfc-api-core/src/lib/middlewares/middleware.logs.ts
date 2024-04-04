import { NextFunction, Request, Response } from 'express';
import { mLog } from '../services';

export const managedLogsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const route = `${req.method} ${req.path}`;
  const timestamp = new Date().toISOString();
  mLog(`${timestamp} | ${req.ip} > ${route}`, 'info');

  next();
};
