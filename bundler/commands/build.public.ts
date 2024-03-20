import { baseNxBuilder, publishManifest } from './utils';

const manifest = publishManifest({
  appName: 'public',
  buildName: 'nfc-public',
  productionContainer: 'public',
  developContainer: 'ptc-public',
  preDeployTasks: [
    ['nx', 'gulp', 'nfc-public'],
    ['cp', './apps/nfc-public/main.js', 'dist/apps/nfc-public/server/main.js'],
  ],
});

export const runPublicClientBuild = async () => {
  await baseNxBuilder(manifest);
};
