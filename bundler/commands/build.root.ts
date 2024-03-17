import { baseNxBuilder, publishManifest } from './utils';

const manifest = publishManifest({
  appName: 'root',
  buildName: 'nfc-root-client',
  productionContainer: 'notify-root-client',
  developContainer: 'ptc-notify-root-client',
});

export const runRootClientBuild = async () => {
  await baseNxBuilder(manifest);
};
