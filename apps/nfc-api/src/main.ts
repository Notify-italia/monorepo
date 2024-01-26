import { LogManager, log } from '@notify/api-shared';
import { server } from './app';
import { connectToDatabase } from './app/services/service.db';
import { LicenseManager } from './app/services/service.license';
import { socketIOServer } from './app/socketio';

const logManager = LogManager.init([], 100);
const port = Bun.env.PORT || 3000;

export const wLog = (...args: Parameters<typeof log>) => {
  args.push(logManager);
  log(...args);
};

wLog(`Starting with Bun version ${Bun.version}`, 'start');

connectToDatabase();

server.listen(port, () => {
  wLog(`listening on port http://localhost:${port}`, 'info');

  const license = LicenseManager.generate({
    expirationDate: new Date('2024-07-01'),
    allowedAgents: 10,
  }).then((license) => {
    wLog(`License: ${license.license.publicKey}`, 'info');
  });
});

socketIOServer.listen(() =>
  wLog(`Listening socket.io on port ${port}`, 'info')
);
