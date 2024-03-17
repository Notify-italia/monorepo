#! /usr/bin/env bun
import chalk from 'chalk';
import { program } from 'commander';
import { runAgentClientBuild } from './commands/build.agent';
import { runApiBuild } from './commands/build.api';
import { runCompanyClientBuild } from './commands/build.company';
import { runPlayerBuild } from './commands/build.player';
import { runPublicClientBuild } from './commands/build.public';
import { runRootClientBuild } from './commands/build.root';
import { deployApps } from './commands/deploy';
import { hasApp, type INotifyAvailableApps } from './commands/utils';

program
  .argument('<apps...>')
  .option('-sp --skip-deploy', 'Skip deploying the apps')
  .option('--production', 'Deploy to production');

program.parse();

export const selectedApps = program.args as INotifyAvailableApps[];
const skipDeploy = program.opts()?.skipDeploy as boolean;
const production = program.opts()?.production as boolean;

if (!selectedApps?.length) {
  console.log(
    chalk.bgRed.white.bold('No apps specified, specify an app with -a flag')
  );
  console.log(chalk.red('Available apps: company, agent, admin, app, all'));

  process.exit(1);
}

await runCompanyClientBuild();

await runAgentClientBuild({ capSync: hasApp('native') || hasApp('all') });

await runRootClientBuild();

await runPlayerBuild();

await runApiBuild();

await runPublicClientBuild();

await runCompanyClientBuild();

if (skipDeploy) {
  process.exit(0);
}

await deployApps(production);
