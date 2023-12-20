import { CapacitorConfig } from '@capacitor/cli';
import ip from 'ip';
const config: CapacitorConfig = {
  appId: 'org.notify.agent.client',
  appName: 'NfcAgentClient',
  ios: {
    path: 'app/ios',
  },
  android: {
    path: 'app/android',
  },
  webDir: '../../dist/apps/nfc-agent-client',
  bundledWebRuntime: false,
};
if (process.env.LIVE === 'true') {
  const localIp = ip.address();
  const port = process.env.PORT || '4200';
  config.server = { url: `http://${localIp}:${port}`, cleartext: true };
} else {
  Reflect.deleteProperty(config, 'server');
}
export default config;
