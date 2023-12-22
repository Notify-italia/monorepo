import { Injectable, ViewContainerRef } from '@angular/core';
import { NfcWriteComponent } from '../components/nfc-write/nfc-write.component';

@Injectable()
export class NfcWriteFactory {
  constructor(public vcr: ViewContainerRef) {}

  public create(config: { value: string }) {
    const ref = this.vcr.createComponent(NfcWriteComponent);

    ref.setInput('value', config.value);
    ref.setInput('cf', ref);

    return ref;
  }
}
