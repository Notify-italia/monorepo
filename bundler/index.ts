#! /usr/bin/env bun
import chalk from 'chalk';
import { program } from 'commander';
import { runAgentClientBuild } from './commands/build.agent';
import { runCompanyClientBuild } from './commands/build.company';
import { runPlayerBuild } from './commands/build.player';
import { hasApp } from './commands/utils';

export type INotifyAvailableApps =
  | 'company'
  | 'api'
  | 'agent'
  | 'admin'
  | 'player'
  | 'native'
  | 'all';

program
  .option(
    '-a, --apps <apps...>',
    'Specify which apps to build',
    (val: string) => val.split(',')
  )
  .option('-sp --skip-deploy', 'Skip deploying the apps');

program.parse();

export const selectedApps = program.opts()?.apps as INotifyAvailableApps[];
const skipDeploy = program.opts()?.skipDeploy as boolean;

if (!selectedApps?.length) {
  console.log(
    chalk.bgRed.white.bold('No apps specified, specify an app with -a flag')
  );
  console.log(chalk.red('Available apps: company, agent, admin, app, all'));

  process.exit(1);
}

if (hasApp('company')) {
  await runCompanyClientBuild();
}

if (hasApp('agent') && !hasApp('native')) {
  await runAgentClientBuild({ capSync: false });
}

if (hasApp('admin')) {
  console.log('Building admin app');
}

if (hasApp('native')) {
  await runAgentClientBuild({ capSync: true });
}

if (hasApp('player')) {
  await runPlayerBuild();
}

if (hasApp('api')) {
  console.log('Building api');
}

if (hasApp('all')) {
  await runCompanyClientBuild();
  await runAgentClientBuild({ capSync: true });
}

if (skipDeploy) {
  process.exit(0);
}
