import { Injectable } from '@angular/core';
import { BaseFactory } from '../../../constructors/base.factory';
import { LicenseFormComponent } from '../components/license-form/license-form.component';

@Injectable()
export class LicenseFormFactory extends BaseFactory {
  public create() {
    return this._createComponent(LicenseFormComponent);
  }
}
