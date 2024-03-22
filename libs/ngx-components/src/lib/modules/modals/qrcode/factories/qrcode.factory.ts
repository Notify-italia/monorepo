import { Injectable, ViewContainerRef } from '@angular/core';
import { QrcodeComponent } from '../components/qrcode/qrcode.component';

@Injectable()
export class QrcodeFactory {
  constructor(private _vcr: ViewContainerRef) {}

  public create(config: {
    data: string;
    title: string;
    size?: number;
    filename?: string;
  }) {
    const ref = this._vcr.createComponent(QrcodeComponent);

    ref.setInput('data', config.data);
    ref.setInput('size', config.size);
    ref.setInput('title', config.title);
    ref.setInput('filename', config.filename);
    ref.setInput('cf', ref);

    return ref;
  }
}
