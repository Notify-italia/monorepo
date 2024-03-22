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
  preDeployTasks?: string[][];
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

export const baseBundler = async (
  manifest: INotifyAppManifest,
  command?: string
) => {
  if (!hasApp(manifest.appName as INotifyAvailableApps) && !hasApp('all')) {
    return;
  }

  whenVerbose(chalk.blue(`Building ${manifest.appName}...`));

  // This code snippet is using a ternary operator to conditionally execute a command based on the presence of the `command` parameter
  const { stdout, stderr, exitCode } = command
    ? Bun.spawnSync(command.split(' '))
    : await $`nx build ${manifest.buildName} ${
        productionOptTrue ? '--prod' : ''
      }`;

  whenVerbose(bufferToString(stdout));

  if (exitCode) {
    printError(stderr, manifest.appName);
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
