import chalk from 'chalk';
import { selectedApps, type INotifyAvailableApps } from '..';

export const bufferToString = (buffer: Buffer) => buffer.toString('utf-8');

export const printError = (stderr: Buffer, appName: string) => {
  console.log(chalk.red(`${appName} build failed`));
  console.log(bufferToString(stderr));
};

export const hasApp = (app: INotifyAvailableApps) => {
  return selectedApps.includes(app);
};
