import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { INotifyProfile } from '@notify/interfaces';
import { BaseFactory } from '../../../../constructors';
import { controlsFromObject } from '../../../../services';
import { InfoPanelComponent } from './info-panel.component';

@Injectable()
export class InfoPanelFactory extends BaseFactory {
  public create(config: {
    loading: boolean;
    profile: INotifyProfile;
    environment: Record<string, unknown>;
    form: FormGroup<controlsFromObject<INotifyProfile['advancedProfile']>>;
    selectedHierarchyItem: string;
  }) {
    return this._createComponent(InfoPanelComponent, config, {
      showStatusBar: true,
    });
  }
}
