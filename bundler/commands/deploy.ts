import chalk from 'chalk';
import { selectedApps } from '..';
import { availableManifests, bufferToString, whenVerbose } from './utils';

export const deployApps = async (production = false) => {
  const mainfests = availableManifests.filter((manifest) => {
    return selectedApps.includes(manifest.appName);
  });

  console.log(
    chalk.blue(
      'Deploying the following apps:',
      mainfests.map((m) => m.appName).join(', ')
    )
  );

  await asyncForEach(mainfests, async (manifest) => {
    await _cpFile(
      `./apps/${manifest.buildName}/Dockerfile`,
      ` ./dist/apps/${manifest.buildName}/Dockerfile`
    );
    await _cpFile(
      `./apps/${manifest.buildName}/captain-definition`,
      ` ./dist/apps/${manifest.buildName}/captain-definition`
    );

    _makeTar(`./dist/apps/${manifest.buildName}`);

    _deploy(manifest, production);

    _removeTar();
    whenVerbose(chalk.green(`${manifest.appName} done`));
  });

  console.log(chalk.bgGreen.white('All apps deployed'));
};

/**
 * a for loop that waits for the callback to finish before moving on to the next iteration.
 * @param {any[]} array - the array you want to loop through
 * @param callback - The function to execute on each element in the array.
 */
export const asyncForEach = async <T>(
  array: T[],
  callback: (curr: T, index: number, array: unknown[]) => unknown
) => {
  for (let i = 0; i < array.length; i++) {
    await callback(array[i], i, array);
  }
};

const _cpFile = async (from: string, to: string) => {
  const file = Bun.file(from);
  await Bun.write(to, file);

  whenVerbose(chalk.blue(`Copied ${from} to ${to}`));
};

const _makeTar = (path: string) => {
  Bun.spawnSync([
    'tar',
    '--strip-components=4',
    '-cvf',
    './deploy.tar',
    '--exclude=*.map',
    path,
  ]);

  whenVerbose(chalk.blue('Created deploy.tar'));
};

const _deploy = (manifest: any, production: boolean) => {
  const { stderr, stdout } = Bun.spawnSync([
    'caprover',
    'deploy',
    '-t',
    './deploy.tar',
    '-n',
    'notify',
    '-a',
    production ? manifest.productionContainer : manifest.developContainer,
  ]);

  whenVerbose(bufferToString(stdout));

  if (stderr) {
    whenVerbose(chalk.red(stderr));
  }

  whenVerbose(
    chalk.blue(
      `Deployed ${manifest.appName} to ${
        production ? manifest.productionContainer : manifest.developContainer
      }`
    )
  );
};

const _removeTar = () => {
  Bun.spawnSync(['rm', './deploy.tar']);

  whenVerbose(chalk.yellow('Removed deploy.tar'));
};
