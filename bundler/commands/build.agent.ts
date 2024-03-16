import { $ } from 'bun';
import chalk from 'chalk';
import { printError } from './utils';

const name = 'agent-client';

export const runAgentClientBuild = async (config: { capSync: boolean }) => {
  console.log(chalk.blue(`Building ${name}...`));
  const { stdout, stderr } = await $`nx build nfc-agent-client --prod`;

  if (stderr.length) {
    printError(stderr, name);
    return;
  }

  console.log(chalk.green.bold(`${name} build successful`));
  console.log(stdout);

  if (config.capSync) {
    console.log(chalk.blue('Syncing Capacitor...'));
    const { stdout, stderr } = Bun.spawn([
      'nx',
      'run',
      'nfc-agent-client:cap:sync',
    ]);
    if (stderr) {
      console.log(chalk.red('Capacitor sync failed'));
      console.log(stderr);
      return;
    }
    console.log(chalk.green.bold('Capacitor sync successful'));
  }
};
