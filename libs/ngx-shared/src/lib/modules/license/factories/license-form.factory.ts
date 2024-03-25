import { Injectable, ViewContainerRef } from '@angular/core';
import { LicenseFormComponent } from '../components/license-form/license-form.component';

@Injectable()
export class LicenseFormFactory {
  constructor(public vcr: ViewContainerRef) {}

  public create() {
    const ref = this.vcr.createComponent(LicenseFormComponent);
    ref.setInput('cf', ref);
    return ref;
  }
}
