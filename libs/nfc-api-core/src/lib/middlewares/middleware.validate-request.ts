import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors';

export const validateRequest = <T>(
  req: Request<T>,
  res: Response,
  next: NextFunction
) => {
  return _validateRequest(req, res, next);
};

// Per come funzionano i middleware in Express, si veda:
// http://expressjs.com/en/guide/using-middleware.html#using-middleware

// Questo middleware VA SEMPRE INSERITO quando si usano i metodi di validazione
// della libreria express-validator, ad esempio:
//  body('description').notEmpty(),
//  body('priority').notEmpty().withMessage('Please Enter priority'),
//  validateRequest,
export const _validateRequest = <T>(
  req: Request<T>,
  res: Response,
  next: NextFunction
) => {
  // isProduction ? undefined : console.log(req.body);
  // Leggendo la documentazione della libreria express-validator si scoprirà
  // che gli errori di validazione generati dalla libreria possono essere
  // recuperati grazie alla funzione validationResult() passando al richiesta (req)
  // si veda: https://express-validator.github.io/docs/

  // Estraggo quindi gli errori
  const errors = validationResult(req as Request);

  // Se ci sono errori (quindi se l'array errors non è vuoto)
  if (!errors.isEmpty()) {
    console.log('validation error', errors.array());
    // Lancio un errore di tipo RequestValidationError passando l'array di errori
    throw new RequestValidationError(errors.array());
  }

  // Altrimenti proseguo con i middleware successivi
  next();
};
