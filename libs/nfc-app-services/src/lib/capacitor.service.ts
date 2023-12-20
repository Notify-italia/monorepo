import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';

@Injectable()
export class CapacitorService {
  public isNative = Capacitor.isNativePlatform();
  public isIOS = Capacitor.getPlatform() === 'ios';
  public isAndroid = Capacitor.getPlatform() === 'android';

  constructor() {}
}
