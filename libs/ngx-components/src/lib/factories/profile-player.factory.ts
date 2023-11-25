import { Injectable, ViewContainerRef } from '@angular/core';

import { INotifyProfile } from '@notify/interfaces';
import { FullscreenMockupComponent } from '../standalones/profile-player/fullscreen-mockup/fullscreen-mockup.component';

@Injectable()
export class ProfilePlayerFactory {
  constructor(public vcr: ViewContainerRef) {}

  public show(config: { profile: INotifyProfile }) {
    const ref = this.vcr.createComponent(FullscreenMockupComponent);

    ref.setInput('cf', ref);
    ref.setInput('data', config.profile);

    return ref;
  }
}
