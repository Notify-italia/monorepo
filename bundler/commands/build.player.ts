import { $ } from 'bun';
import chalk from 'chalk';
import { printError } from './utils';

const name = 'player';

export const runPlayerBuild = async () => {
  console.log(chalk.blue(`Building ${name}...`));
  const { stdout, stderr } = await $`nx build nfc-player --prod`;

  if (stderr.length) {
    printError(stderr, name);
    return;
  }

  console.log(chalk.green.bold(`${name} build successful`));
};
