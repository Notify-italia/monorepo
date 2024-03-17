import { baseNxBuilder, publishManifest } from './utils';

const manifest = publishManifest({
  appName: 'company',
  buildName: 'nfc-company-client',
  productionContainer: 'company-client',
  developContainer: 'ptc-company-client',
});

export const runCompanyClientBuild = async () => {
  await baseNxBuilder(manifest);
};
