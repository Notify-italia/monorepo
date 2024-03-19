import { $ } from 'bun';
import chalk from 'chalk';
import { productionOptTrue, selectedApps, verboseEnabled } from '..';

export type INotifyAvailableApps =
  | 'company'
  | 'api'
  | 'agent'
  | 'public'
  | 'player'
  | 'native'
  | 'root'
  | 'all';

export interface INotifyAppManifest {
  appName: INotifyAvailableApps;
  buildName: string;
  productionContainer: string;
  developContainer: string;
}

export const availableManifests: INotifyAppManifest[] = [];

export const bufferToString = (buffer: Buffer) => buffer.toString('utf-8');

export const printError = (stderr: Buffer, appName: string) => {
  console.log(chalk.red(`${appName} build failed`));
  console.log(bufferToString(stderr));
  process.exit(1);
};

export const hasApp = (app: INotifyAvailableApps) => {
  return selectedApps.includes(app);
};

export const baseNxBuilder = async (manifest: INotifyAppManifest) => {
  if (!hasApp(manifest.appName as INotifyAvailableApps) && !hasApp('all')) {
    return;
  }

  console.log(chalk.blue(`Building ${manifest.appName}...`));
  const { stdout, stderr } = await $`nx build ${manifest.buildName} ${
    productionOptTrue ? '--prod' : ''
  }`;

  if (stderr.length) {
    printError(stderr, manifest.appName);
    return;
  }

  console.log(chalk.green.bold(`${manifest.appName} build successful`));

  return stdout;
};

export const publishManifest = (
  config: INotifyAppManifest
): INotifyAppManifest => {
  availableManifests.push(config);
  return config;
};

export const whenVerbose = (chalk: string) => {
  if (!verboseEnabled) {
    return;
  }

  console.log(chalk);
};
