import { Injectable, ViewContainerRef } from '@angular/core';
import { ShareFileModalComponent } from '../components/share-file-modal/share-file-modal.component';

@Injectable()
export class ShareFileModalFactory {
  constructor(public vcr: ViewContainerRef) {}

  public create() {
    const ref = this.vcr.createComponent(ShareFileModalComponent);
    ref.setInput('cf', ref);

    return ref;
  }
}
