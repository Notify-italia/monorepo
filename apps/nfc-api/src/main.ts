import { LogManager, log } from '@notify/api-shared';
import { server } from './app';
import { connectToDatabase } from './app/services/service.db';
import { socketIOServer } from './app/socketio';

const logManager = LogManager.init([], 100);
const port = Bun.env.PORT || 3000;

export const wLog = (...args: Parameters<typeof log>) => {
  args.push(logManager);
  log(...args);
};

wLog(
  `Starting with Bun version ${Bun.version} with BUN_ENV ${Bun.env.BUN_ENV}`,
  'start'
);

connectToDatabase();

server.listen(port, () => {
  wLog(`listening on port http://localhost:${port}`, 'info');
});

socketIOServer.listen(() =>
  wLog(`Listening socket.io on port ${port}`, 'info')
);
