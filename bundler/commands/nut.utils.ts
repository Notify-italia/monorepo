import chalk from 'chalk';
import type { Command } from 'commander';

export const NotifyAvailableApps = [
  'company',
  'api',
  'agent',
  'public',
  'player',
  'native',
  'root',
  'all',
] as const;

export type INotifyAvailableApps = (typeof NotifyAvailableApps)[number];

export interface INotifyAppManifest {
  appName: INotifyAvailableApps;
  buildName: string;
  productionContainer: string;
  developContainer: string;
  preDeployTasks?: string[][];
}

export const availableManifests: INotifyAppManifest[] = [];

export let selectedApps: string[] = [];
export let verboseEnabled: boolean = false;
export let productionOptTrue: boolean = false;
export let openAfterSync: '-ios' | '-android' | '-both' | undefined;

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
  command = `nx build ${manifest.buildName} ${
    productionOptTrue ? '--prod' : ''
  }`
) => {
  if (!hasApp(manifest.appName as INotifyAvailableApps) && !hasApp('all')) {
    return;
  }

  whenVerbose(chalk.blue(`Building ${manifest.appName}...`));

  // This code snippet is using a ternary operator to conditionally execute a command based on the presence of the `command` parameter
  const { stdout, stderr, exitCode } = executeShell(command);

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

export const parseCommand = (
  program: Command,
  config?: {
    appsOptional?: boolean;
  }
) => {
  console.log(chalk.hex('#E8AF48').bold('N.U.T. - Notify Utility Tool 🥜'));

  selectedApps = program.args
    .filter((v) => NotifyAvailableApps.includes(v as INotifyAvailableApps))
    .map((v) => v as INotifyAvailableApps);

  verboseEnabled = _hasOption(program, ['-v', '--verbose']) as boolean;
  productionOptTrue = _hasOption(program, ['-prod', '--production']) as boolean;
  openAfterSync = _hasOption(program, ['-ios', '-android', '-both'], true) as
    | '-ios'
    | '-android'
    | '-both'
    | undefined;

  if (productionOptTrue) {
    console.log(
      chalk.yellowBright.bold('YOU ARE DOING PRODUCTION STUFF. BE CAREFUL!')
    );
  }

  if (!selectedApps?.length && !config?.appsOptional) {
    console.log(
      chalk.bgRed.white.bold('No apps specified, specify an app with -a flag')
    );
    console.log(chalk.red('Available apps: company, agent, admin, app, all'));

    process.exit(1);
  }

  if (!config?.appsOptional) {
    console.log(
      chalk.blue('Selected apps:', chalk.bold.white(selectedApps.join(', ')))
    );
  }

  return {
    selectedApps,
    verboseEnabled,
    productionOptTrue,
  };
};

const _hasOption = (
  program: Command,
  option: string[],
  returnOption = false
) => {
  if (returnOption) {
    return option.find((v) => program.args.includes(v));
  }
  return option.some((v) => program.args.includes(v));
};

export const executeShell = (command: string) => {
  return Bun.spawnSync(command.split(' '));
};
