import { $ } from 'bun';
import chalk from 'chalk';
import {
  hasApp,
  printError,
  publishManifest,
  whenVerbose,
  type INotifyAvailableApps,
} from './utils';

const manifest = publishManifest({
  appName: 'agent',
  buildName: 'nfc-agent-client',
  productionContainer: 'profiles-agent-client',
  developContainer: 'ptc-profiles-agent-client',
});

export const runAgentClientBuild = async (config: { capSync: boolean }) => {
  if (
    !hasApp(manifest.appName as INotifyAvailableApps) &&
    !hasApp('native') &&
    !hasApp('all')
  ) {
    return;
  }

  whenVerbose(chalk.blue(`Building ${manifest.appName}...`));
  const { stderr, exitCode } = await $`nx build ${manifest.buildName} --prod`;

  if (exitCode) {
    printError(stderr, manifest.appName);
    return;
  }

  console.log(chalk.green.bold(`${manifest.appName} build successful`));

  if (config.capSync) {
    console.log(chalk.blue('Syncing Capacitor...'));
    const { stderr, exitCode } = await $`nx run ${manifest.buildName}:cap:sync`;
    if (exitCode) {
      console.log(chalk.red('Capacitor sync failed'));
      console.log(stderr);
      return;
    }
    console.log(chalk.green.bold('Capacitor sync successful'));
  }
};
