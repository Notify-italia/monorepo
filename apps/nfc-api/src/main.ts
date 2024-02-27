import { LogManager, log } from '@notify/api-shared';
import * as Sentry from '@sentry/node';
import { server } from './app';
import { connectToDatabase } from './app/services/service.db';
import { declareEnvs } from './app/services/service.envs';
import { socketIOServer } from './app/socketio';

const { SENTRY_DSN, BUN_ENV, PORT } = declareEnvs(['SENTRY_DSN', 'BUN_ENV']);
const logManager = LogManager.init([], 100);
const port = PORT || 3000;

Sentry.init({ dsn: SENTRY_DSN });

export const wLog = (...args: Parameters<typeof log>) => {
  args.push(logManager);
  log(...args);
};

wLog(
  `Starting with Bun version ${Bun.version} with BUN_ENV ${BUN_ENV}`,
  'start'
);

connectToDatabase();

server.listen(port, () => {
  wLog(`listening on port http://localhost:${port}`, 'info');
});

socketIOServer.listen(() =>
  wLog(`Listening socket.io on port ${port}`, 'info')
);
