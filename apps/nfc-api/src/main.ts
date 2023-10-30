import { LogManager, log as Logging } from '@notify/nfc-app-services';
import app from './app';
import { connectToDatabase } from './app/services/service.db';

const logManager = LogManager.init([], 100);

export const wLog = (...args: Parameters<typeof Logging>) => {
  args.push(logManager);
  Logging(...args);
};

connectToDatabase();

app.listen(Bun.env.PORT || 3000, () => {
  console.log(`running on port http://localhost:${Bun.env.PORT}`);
});
