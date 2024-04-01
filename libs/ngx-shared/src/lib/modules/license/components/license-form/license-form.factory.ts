import { Injectable } from '@angular/core';
import { BaseFactory } from '../../../../constructors/base.factory';
import { LicenseFormComponent } from './license-form.component';

@Injectable()
export class LicenseFormFactory extends BaseFactory {
  public create() {
    return this._createComponent(LicenseFormComponent);
  }
}
