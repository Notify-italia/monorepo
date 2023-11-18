import { LogManager, log } from '@notify/api-shared';
import app from './app';
import { connectToDatabase } from './app/services/service.db';
import { LicenseManager } from './app/services/service.license';

const logManager = LogManager.init([], 100);

export const wLog = (...args: Parameters<typeof log>) => {
  args.push(logManager);
  log(...args);
};

wLog(`Starting with Bun version ${Bun.version}`, 'start');

connectToDatabase();

app.listen(Bun.env.PORT || 3000, () => {
  wLog(`listening on port http://localhost:${Bun.env.PORT}`, 'info');

  LicenseManager.generate({
    expirationDate: new Date(),
  }).then((l) => {
    wLog(l.license.publicKey, 'info');
  });
});
