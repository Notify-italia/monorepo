import { Injectable } from '@angular/core';
import { BaseFactory } from '../../../../constructors/base.factory';
import { NfcWriteComponent } from '../components/nfc-write/nfc-write.component';

@Injectable()
export class NfcWriteFactory extends BaseFactory {
  public create(config: {
    userProfile: string;
    companyProfile?: string;
    profilesUrl: string;
    blurBackground?: boolean;
  }) {
    return this._createComponent(NfcWriteComponent, {
      ...config,
      blurBackground: config.blurBackground ?? true,
    });
  }
}
