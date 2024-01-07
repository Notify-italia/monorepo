import { Injectable } from '@angular/core';
import {
  GetBrightnessReturnValue,
  ScreenBrightness,
} from '@capacitor-community/screen-brightness';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';

@Injectable()
export class CapacitorService {
  public isNative = Capacitor.isNativePlatform();
  public isIOS = Capacitor.getPlatform() === 'ios';
  public isAndroid = Capacitor.getPlatform() === 'android';

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

  public async setBrightness(brightness: number): Promise<void> {
    if (!this.isNative) {
      return;
    }

    await ScreenBrightness.setBrightness({ brightness }).catch((error) =>
      console.error(`Error setting brightness: ${error}`)
    );
  }

  public async saveImage(config: { filename: string; data: string }) {
    await Filesystem.writeFile({
      path: config.filename,
      data: config.data,
      directory: Directory.Data,
      recursive: true,
    });
  }

  constructor() {}
}
