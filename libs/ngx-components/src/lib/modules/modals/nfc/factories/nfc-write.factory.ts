import { Injectable, ViewContainerRef } from '@angular/core';
import { NfcWriteComponent } from '../components/nfc-write/nfc-write.component';

@Injectable()
export class NfcWriteFactory {
  constructor(public vcr: ViewContainerRef) {}

  public create(config: {
    userProfile: string;
    companyProfile?: string;
    profilesUrl: string;
  }) {
    const ref = this.vcr.createComponent(NfcWriteComponent);

    ref.setInput('userProfile', config.userProfile);
    ref.setInput('companyProfile', config.companyProfile);
    ref.setInput('cf', ref);
    ref.setInput('profilesUrl', config.profilesUrl);

    return ref;
  }
}
