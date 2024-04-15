import { Injectable } from '@angular/core';
import { BaseFactory } from '../../../constructors/base.factory';
import { NfcWriteComponent } from './nfc-write.component';

@Injectable()
export class NfcWriteFactory extends BaseFactory {
  public create(config: {
    items: {
      value: string;
      label: string;
    }[];
    questionLabel?: string;
    confirmationLabel?: string;
    blurBackground: boolean;
    playerBaseUrl: string;
  }) {
    return this._createComponent(NfcWriteComponent, {
      ...config,
      blurBackground: config.blurBackground ?? true,
    });
  }
}
