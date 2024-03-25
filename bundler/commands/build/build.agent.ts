import chalk from 'chalk';
import {
  bufferToString,
  executeShell,
  hasApp,
  printError,
  publishManifest,
  whenVerbose,
  type INotifyAvailableApps,
} from '../nut.utils';

const manifest = publishManifest({
  appName: 'agent',
  buildName: 'nfc-agent-client',
  productionContainer: 'profiles-agent-client',
  developContainer: 'ptc-profiles-agent-client',
});

export const runAgentClientBuild = async (config: {
  capSync: boolean;
  force?: boolean;
}) => {
  if (
    !hasApp(manifest.appName as INotifyAvailableApps) &&
    !hasApp('native') &&
    !hasApp('all') &&
    !config.force
  ) {
    return;
  }

  whenVerbose(chalk.blue(`Building ${manifest.appName}...`));
  const { stderr, exitCode } = executeShell(
    `nx build ${manifest.buildName} --prod`
  );

  if (exitCode) {
    printError(stderr, manifest.appName);
    return;
  }

  console.log(chalk.green.bold(`${manifest.appName} build successful`));

  if (config.capSync) {
    console.log(chalk.blue('Syncing Capacitor...'));
    const { stderr, exitCode, stdout } = executeShell(
      `nx run ${manifest.buildName}:cap:sync`
    );

    whenVerbose(bufferToString(stdout));

    if (exitCode) {
      console.log(chalk.red('Capacitor sync failed'));
      console.log(stderr);
      return;
    }
    console.log(chalk.green.bold('Capacitor sync successful'));
  }

  return manifest;
};
