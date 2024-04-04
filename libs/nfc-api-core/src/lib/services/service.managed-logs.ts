import { LogManager, log } from '@notify/api-shared';
export const managedLogs = LogManager.init([], 100);

export const mLog = (...args: Parameters<typeof log>) => {
  args.push(managedLogs);
  log(...args);
};
