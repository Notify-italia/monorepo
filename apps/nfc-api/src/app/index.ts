//boilerplate for an express app
import express from 'express';
import { api } from './routes';

import { logRequest } from '../middlewares/middleware.logs';
import { NotFoundError } from '../services/errors/errors';
import { errorHandler } from '../services/errors/middlewares';

const app = express();

app.use(express.json());

app.use(logRequest);

app.use('/api', api);

// Deve sempre essere in fondo a tutte le altre routes perché serve a mostrare un errore qualora
// si cercasse di accedere ad una route che non esiste
app.all('*', () => {
  throw new NotFoundError();
});

//TODO fix error stack
// È un middleware creato ad hoc per gestire gli errori che possono generarsi e per restituirli
// sempre nel solito formato al client
app.use(errorHandler);

export default app;
