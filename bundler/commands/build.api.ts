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
  appName: 'api',
  buildName: 'nfc-api',
  productionContainer: 'notify-api',
  developContainer: 'ptc-notify-api',
});

export const runApiBuild = async () => {
  if (!hasApp(manifest.appName as INotifyAvailableApps) && !hasApp('all')) {
    return;
  }

  whenVerbose(chalk.blue(`Building ${manifest.appName}...`));
  const { stdout, stderr } =
    await $`bun build --target=bun ./apps/${manifest.buildName}/src/main.ts --outdir ./dist/apps/${manifest.buildName}`;

  if (stderr.length) {
    printError(stderr, manifest.appName);
    return;
  }

  console.log(chalk.green.bold(`${manifest.appName} build successful`));

  return stdout;
};
