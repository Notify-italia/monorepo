#! /usr/bin/env bun
import { program } from 'commander';
import { buildApps } from './commands/build';

import { runAgentClientBuild } from './commands/build/build.agent';
import { deployApps } from './commands/nut.deploy';
import {
  executeShell,
  openAfterSync,
  parseCommand,
} from './commands/nut.utils';

program
  .command('deploy <apps>')
  .option('-prod --production', 'Deploy to production')
  .option('-v --verbose', 'Verbose output')
  .action(async () => {
    const { productionOptTrue } = parseCommand(program);

    await buildApps();

    await deployApps(productionOptTrue);
  });

program
  .command('build <apps...>')
  .option('-prod --production', 'Deploy to production')
  .option('-v --verbose', 'Verbose output')
  .action(async () => {
    parseCommand(program);

    await buildApps();
  });

program
  .command('cap sync')
  .option('-v --verbose', 'Verbose output')
  .option('-ios', 'Open XCode after sync')
  .option('-android', 'Open Android Studio after sync')
  .option('-both', 'Open both IDEs after sync')
  .action(async () => {
    parseCommand(program, { appsOptional: true });

    const manifest = await runAgentClientBuild({ capSync: true, force: true });

    if (!openAfterSync || !manifest) {
      return;
    }

    console.log('Opening IDE(s)...');

    if (openAfterSync === '-both') {
      executeShell(`nx run ${manifest.buildName}:cap:open-ios`);
      executeShell(`nx run ${manifest.buildName}:cap:open-android`);
      return;
    }

    executeShell(`nx run ${manifest.buildName}:cap:open${openAfterSync}`);
  });

program.parse();
