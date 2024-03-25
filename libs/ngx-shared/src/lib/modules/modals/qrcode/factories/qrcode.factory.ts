import { Injectable } from '@angular/core';
import { BaseFactory } from '../../../../constructors/base.factory';
import { QrcodeComponent } from '../components/qrcode/qrcode.component';

@Injectable()
export class QrcodeFactory extends BaseFactory {
  public create(config: {
    data: string;
    title: string;
    size?: number;
    filename?: string;
    blurBackground?: boolean;
  }) {
    return this._createComponent(QrcodeComponent, {
      ...config,
      blurBackground: config.blurBackground ?? true,
    });
  }
}
