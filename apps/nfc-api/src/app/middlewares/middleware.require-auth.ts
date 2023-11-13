import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify as JwtVerify, VerifyErrors } from 'jsonwebtoken';
import { wLog } from '../../main';
import { Agent } from '../models/model.agent';
import { Company } from '../models/model.company';
import {
  NotAuthorizedError,
  RequiredEnvVariableError,
  TokenExpiredError,
} from '../services/errors/errors';
import { EnumTargetDb } from '../services/service.db';
import { declareEnvs } from '../services/service.envs';

const { JWT_KEY } = declareEnvs(['JWT_KEY']);

// Per come funzionano i middleware in Express, si veda:
// http://expressjs.com/en/guide/using-middleware.html#using-middleware

interface UserPayload extends Company, Agent {
  iat: number;
  exp: number;
  userType: EnumTargetDb;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
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

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('Authorization')?.replace('Bearer ', '') || '';

  if (!JWT_KEY) {
    throw new RequiredEnvVariableError('JWT_KEY');
  }

  const payload = (await verifyJwt(token, JWT_KEY).catch((error) => {
    if (error && error.name === 'TokenExpiredError') {
      throw new TokenExpiredError();
    }

    wLog(error.message, 'error');
    throw new NotAuthorizedError();
  })) as UserPayload;

  req.currentUser = payload;

  if (!req.currentUser || !req.currentUser.enabled) {
    throw new NotAuthorizedError();
  }

  next();
};
