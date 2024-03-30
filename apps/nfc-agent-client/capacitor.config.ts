import { CapacitorConfig } from '@capacitor/cli';

//TODO aggiorna info.plist se cambi qualcosa
const config: CapacitorConfig = {
  appId: 'org.notify.agent.client',
  appName: 'Notify Italia',

  ios: {
    path: 'app/ios',
  },
  android: {
    path: 'app/android',
  },

  webDir: '../../dist/apps/nfc-agent-client',
};

export default config;
