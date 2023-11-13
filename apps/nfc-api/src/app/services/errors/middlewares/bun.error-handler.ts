import { wLog } from 'apps/nfc-api/src/main';
import { Request, Response } from 'express';
//express middleware
export const errorHandledRequest = <T>(
  func: (req: Request<T>, res: Response) => Promise<void>,
  errorMessage?: string
) => {
  return async (req: Request<T>, res: Response) => {
    try {
      await func(req, res);
    } catch (err) {
      wLog(String(err), 'error');

      const toSend = { errors: [{ message: errorMessage || String(err) }] };

      console.log(toSend);

      res.status(400).send(toSend);
    }
  };
};
