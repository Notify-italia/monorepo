import { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'org.notify.agent.client',
  appName: 'Notify',

  ios: {
    path: 'app/ios',
  },
  android: {
    path: 'app/android',
    buildOptions: {
      keystorePath: './notify.keystore',
      keystoreAlias: 'notify',
      keystorePassword: 'wqPL46#6$Ium',
      keystoreAliasPassword: 'wqPL46#6$Ium',
    },
  },
  webDir: '../../dist/apps/nfc-agent-client',
};

export default config;
