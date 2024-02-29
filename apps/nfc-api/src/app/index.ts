import cors from 'cors';
import express from 'express';
import http from 'http';
import { logRequest } from './middlewares/middleware.logs';
import { api } from './routes';
import { NotFoundError } from './services/errors/errors';
import { errorHandler } from './services/errors/middlewares/error-handler';

const app = express();

app.use(express.json({ limit: '50mb' }));

app.use(logRequest);

app.use(
  cors({
    origin: '*',
  })
);

app.use('/api', api);

// Deve sempre essere in fondo a tutte le altre routes perché serve a mostrare un errore qualora
// si cercasse di accedere ad una route che non esiste
app.all('*', () => {
  throw new NotFoundError();
});

// È un middleware creato ad hoc per gestire gli errori che possono generarsi e per restituirli
// sempre nel solito formato al client
app.use(errorHandler);

const server = http.createServer(app);

export { server };
