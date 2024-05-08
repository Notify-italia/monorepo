import { Injectable } from '@angular/core';
import { INotifyProfile } from '@notify/interfaces';
import { BaseFactory } from '../../../../constructors/base.factory';
import { ProfileShareSettingsComponent } from './profile-share-settings.component';

@Injectable()
export class ProfileShareSettingsFactory extends BaseFactory {
  public create(config: { profile: INotifyProfile; baseUrl: string }) {
    return this._createComponent(ProfileShareSettingsComponent, config);
  }
}
