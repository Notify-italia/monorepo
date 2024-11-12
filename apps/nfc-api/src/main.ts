import {
  connectToDatabase,
  expressRouter,
  initSocketio,
  mLog,
} from '@notify/nfc-api-core';
import * as Sentry from '@sentry/bun';
import { declareEnvs } from 'libs/nfc-api-core/src/lib/services/service.envs';
import { api } from './app/routes';
import { socketEvents } from './app/socketio';

const { SENTRY_DSN, BUN_ENV, PORT } = declareEnvs(['SENTRY_DSN', 'BUN_ENV']);

const port = PORT || 3000;

const server = expressRouter(api);

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0, // Capture 100% of the transactions
});

mLog(
  `Starting with Bun version ${Bun.version} with BUN_ENV ${BUN_ENV}`,
  'start'
);

mLog(`Current dir is ${import.meta.path}`, 'info');

connectToDatabase();

server.listen(port, () => {
  mLog(`listening on port http://localhost:${port}`, 'info');
});

initSocketio(server, socketEvents).listen(() =>
  mLog(`Listening socket.io on port ${port}`, 'info')
);
