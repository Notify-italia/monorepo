import { Injectable } from '@angular/core';
import { INotifyProfile } from '@notify/interfaces';
import { BaseFactory } from '../../../constructors/base.factory';
import { FullscreenMockupComponent } from '../components/fullscreen-mockup/fullscreen-mockup.component';

@Injectable()
export class ProfilePlayerFactory extends BaseFactory {
  public create(config: {
    profile: INotifyProfile;
    baseUrl?: string;
    hideShare?: boolean;
  }) {
    return this._createComponent(FullscreenMockupComponent, {
      ...config,
    });
  }
}
