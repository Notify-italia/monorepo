import { connectToDatabase, mLog } from '@notify/nfc-api-core';
import * as Sentry from '@sentry/bun';
import { declareEnvs } from 'libs/nfc-api-core/src/lib/services/service.envs';
import { server } from './app';
import { socketIOServer } from './app/socketio';

const { SENTRY_DSN, BUN_ENV, PORT } = declareEnvs(['SENTRY_DSN', 'BUN_ENV']);

const port = PORT || 3000;

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0, // Capture 100% of the transactions
});

mLog(
  `Starting with Bun version ${Bun.version} with BUN_ENV ${BUN_ENV}`,
  'start'
);

connectToDatabase();

server.listen(port, () => {
  mLog(`listening on port http://localhost:${port}`, 'info');
});

socketIOServer.listen(() =>
  mLog(`Listening socket.io on port ${port}`, 'info')
);
