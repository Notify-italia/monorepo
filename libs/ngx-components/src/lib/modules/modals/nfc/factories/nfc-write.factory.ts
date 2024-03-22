import { Injectable, ViewContainerRef } from '@angular/core';
import { NfcWriteComponent } from '../components/nfc-write/nfc-write.component';

@Injectable()
export class NfcWriteFactory {
  constructor(public vcr: ViewContainerRef) {}

  public create(config: { value: string; profilesUrl: string }) {
    const ref = this.vcr.createComponent(NfcWriteComponent);

    ref.setInput('value', config.value);
    ref.setInput('cf', ref);
    ref.setInput('profilesUrl', config.profilesUrl);

    return ref;
  }
}
