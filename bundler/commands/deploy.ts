import { $ } from 'bun';
import chalk from 'chalk';
import { selectedApps } from '..';
import { availableManifests } from './utils';

export const deployApps = async (production = false) => {
  const mainfests = availableManifests.filter((manifest) => {
    return selectedApps.includes(manifest.appName);
  });

  console.log(
    chalk.bgBlue.white(
      'Deploying the following apps:',
      mainfests.map((m) => m.appName).join(', ')
    )
  );

  await asyncForEach(mainfests, async (manifest) => {
    const cpDockerFile = `cp ./apps/${manifest.buildName}/Dockerfile ./dist/apps/${manifest.buildName}`;
    const cpCaptainDefinition = `cp ./apps/${manifest.buildName}/captain-definition ./dist/apps/${manifest.buildName}`;
    const makeTar = `tar --strip-components=4 -cvf ./deploy.tar --exclude='*.map' ./dist/apps/${manifest.buildName}`;
    const deploy = `caprover deploy -t ./deploy.tar -n notify -a ${
      production ? manifest.productionContainer : manifest.developContainer
    }`;
    const rmTar = `rm ./deploy.tar`;

    await $`${cpDockerFile} && ${cpCaptainDefinition} && ${makeTar} && ${deploy} && ${rmTar}`;
  });
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
