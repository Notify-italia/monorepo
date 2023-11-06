import { LogManager, log as Logging } from '@notify/nfc-app-services';
import app from './app';
import { connectToDatabase } from './services/service.db';

const logManager = LogManager.init([], 100);

export const wLog = (...args: Parameters<typeof Logging>) => {
  args.push(logManager);
  Logging(...args);
};

wLog(`Starting with Bun version ${Bun.version}`, 'start');

connectToDatabase();

app.listen(Bun.env.PORT || 3000, () => {
  wLog(`listening on port http://localhost:${Bun.env.PORT}`, 'info');
});
