import { NextFunction, Request, Response } from 'express';
import { NotAuthorizedError } from '../errors';
import { declareEnvs, mLog } from '../services';

const { API_KEY } = declareEnvs(['API_KEY']);

/**
 * Wrapper di un middleware che richiede un API Key per accedere alla route a cui è applicato
 */
export const requireApiKey = <T>() => {
  //* il middleware deve essere asincrono per poter gestire correttamente gli errori
  return async (req: Request<T>, res: Response, next: NextFunction) => {
    const route = `${req.method} ${req.path}`;
    const timestamp = new Date().toISOString();

    if (req.headers['x-api-key'] !== API_KEY) {
      mLog(`${timestamp} | ${route} | Invalid API Key `, 'error');
      throw new NotAuthorizedError();
    }

    next();
  };
};
