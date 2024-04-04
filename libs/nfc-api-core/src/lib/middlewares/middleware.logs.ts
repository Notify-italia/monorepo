import { log } from '@notify/api-shared';
import { NextFunction, Request, Response } from 'express';

export const managedLoggerMiddleware = (wLog: typeof log) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const route = `${req.method} ${req.path}`;
    const timestamp = new Date().toISOString();
    wLog(`${timestamp} | ${req.ip} > ${route}`, 'info');

    next();
  };
};
