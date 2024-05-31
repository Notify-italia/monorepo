import { Injectable } from '@angular/core';
import { INotifyProfile } from '@notify/interfaces';
import { BaseFactory } from '../../../../constructors/base.factory';
import { FullscreenMockupComponent } from './fullscreen-mockup.component';

@Injectable()
export class ProfilePlayerFactory extends BaseFactory {
  public create(config: {
    profile: INotifyProfile;
    baseUrl?: string;
    hideShare?: boolean;
    isRunningOnPlayer: boolean;
  }) {
    return this._createComponent(FullscreenMockupComponent, {
      ...config,
    });
  }
}
