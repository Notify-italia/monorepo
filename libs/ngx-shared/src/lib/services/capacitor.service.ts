import { Injectable } from '@angular/core';
import { Media } from '@capacitor-community/media';
import {
  GetBrightnessReturnValue,
  ScreenBrightness,
} from '@capacitor-community/screen-brightness';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import {
  Nfc,
  NfcPlugin,
  NfcTag,
  NfcTagScannedEvent,
  NfcUtils,
} from '@capawesome-team/capacitor-nfc';

@Injectable()
export class CapacitorService {
  public isNative = Capacitor.isNativePlatform();
  public isIOS = Capacitor.getPlatform() === 'ios';
  public isAndroid = Capacitor.getPlatform() === 'android';
  public isDesktop = Capacitor.getPlatform() === 'web';

  public nfcUtils = new NfcUtils();

  public get brightness(): Promise<GetBrightnessReturnValue> {
    return new Promise<GetBrightnessReturnValue>((resolve, reject) => {
      if (!this.isNative) {
        return resolve({ brightness: 0 });
      }
      return ScreenBrightness.getBrightness()
        .then((brightness: GetBrightnessReturnValue) => resolve(brightness))
        .catch((error) => reject(error));
    });
  }

  public get impactStyles() {
    return ImpactStyle;
  }

  public triggerHapticFeedback(style: ImpactStyle) {
    if (!this.isNative) {
      return;
    }

    // iOS
    Haptics.impact({ style }).catch((error) => {
      console.error(`Error triggering haptic feedback: ${error}`); // Android
      Haptics.vibrate();
    });
  }

  public async setBrightness(brightness: number): Promise<void> {
    if (!this.isNative) {
      return;
    }

    await ScreenBrightness.setBrightness({ brightness }).catch((error) =>
      console.error(`Error setting brightness: ${error}`)
    );
  }

  public async saveImage(config: { filename: string; data: string }) {
    await Media.savePhoto({
      path: `Notify/${config.filename}`,
      fileName: config.filename,
    });
  }

  public async scanNFCTag(
    callback: (
      Nfc: NfcPlugin,
      tag: NfcTag | undefined,
      source: 'scanSessionCanceled' | 'scanSessionError' | 'nfcTagScanned'
    ) => unknown
  ) {
    if (!this.isNative) {
      return;
    }

    const eventHandler = async (
      resolve: () => void,
      source: 'scanSessionCanceled' | 'scanSessionError' | 'nfcTagScanned',
      event?: NfcTagScannedEvent
    ) => {
      await callback(Nfc, event?.nfcTag, source);
      Nfc.stopScanSession();
      Nfc.removeAllListeners();
      resolve();
    };

    await new Promise<void>((resolve) => {
      Nfc.addListener('scanSessionCanceled', async () => {
        console.log('NFC Scan Session Canceled 🚀');
        await eventHandler(resolve, 'scanSessionCanceled');
      });

      Nfc.addListener('scanSessionError', async () => {
        console.log('NFC Scan Session Error 🚀');
        await eventHandler(resolve, 'scanSessionError');
      });

      Nfc.addListener('nfcTagScanned', async (event) => {
        console.log('NFC Tag Scanned 🚀');
        await eventHandler(resolve, 'nfcTagScanned', event);
      });

      Nfc.startScanSession();
    });
  }

  public prepareURINDEF(uri: string) {
    return this.nfcUtils.createNdefUriRecord({
      uri,
    }).record;
  }
}
