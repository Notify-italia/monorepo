import { Injectable } from '@angular/core';
import { INotifyLicense } from '@notify/interfaces';
import { BaseFactory } from '../../../../constructors/base.factory';
import { LicenseFormFullComponent } from './license-form-full.component';

@Injectable()
export class LicenseFormFullFactory extends BaseFactory {
  public create(license?: INotifyLicense) {
    return this._createComponent(LicenseFormFullComponent, {
      license: license,
    });
  }
}
