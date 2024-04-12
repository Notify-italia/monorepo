//aggiungere funzione che manda email di conferma operazione all'email che ha richiesto il servizio.

import { mLog } from '../services';
import { BadRequestError } from './bad-request-error';

export const genericErrorHandler = async (error: Error) => {
  mLog(JSON.stringify(error), 'error');

  const message =
    error && error.message
      ? error.message
      : `Errore generico ${JSON.stringify(error)}`;

  throw new BadRequestError(message);
};
