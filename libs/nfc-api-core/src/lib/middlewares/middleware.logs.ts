import { NextFunction, Request, Response } from 'express';
import { wLog } from '../services';

export const managedLogsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const route = `${req.method} ${req.path}`;
  const timestamp = new Date().toISOString();
  wLog(`${timestamp} | ${req.ip} > ${route}`, 'info');

  next();
};
