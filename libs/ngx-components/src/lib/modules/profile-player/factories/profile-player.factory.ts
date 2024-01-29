import { Injectable, ViewContainerRef } from '@angular/core';
import { INotifyProfile } from '@notify/interfaces';
import { FullscreenMockupComponent } from '../components/fullscreen-mockup/fullscreen-mockup.component';

@Injectable()
export class ProfilePlayerFactory {
  constructor(public vcr: ViewContainerRef) {}

  public createPlayer(config: { profile: INotifyProfile; baseUrl?: string }) {
    const ref = this.vcr.createComponent(FullscreenMockupComponent);

    ref.setInput('cf', ref);
    ref.setInput('data', config.profile);
    ref.setInput('baseUrl', config.baseUrl);

    return ref;
  }
}
