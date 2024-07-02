import { Injectable } from '@angular/core';
import { INotifyPopulatedLicense } from '@notify/interfaces';
import { BaseFactory } from '../../../../constructors/base.factory';
import { LicenseFormFullComponent } from './license-form-full.component';

@Injectable()
export class LicenseFormFullFactory extends BaseFactory {
  public create(license?: INotifyPopulatedLicense) {
    return this._createComponent(LicenseFormFullComponent, {
      license,
    });
  }
}
