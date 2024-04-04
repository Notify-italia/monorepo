import { LogManager, log } from '@notify/api-shared';
const logManager = LogManager.init([], 100);

export const wLog = (...args: Parameters<typeof log>) => {
  args.push(logManager);
  log(...args);
};
