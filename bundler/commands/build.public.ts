import { baseNxBuilder, publishManifest } from './utils';

const manifest = publishManifest({
  appName: 'public',
  buildName: 'nfc-public',
  productionContainer: 'public',
  developContainer: 'ptc-public',
});

export const runPublicClientBuild = async () => {
  await baseNxBuilder(manifest);
};
