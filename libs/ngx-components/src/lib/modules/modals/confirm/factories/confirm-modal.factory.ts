import { Injectable, ViewContainerRef } from '@angular/core';
import {
  ConfirmComponent,
  IConfirmModalConfig,
} from '../components/confirm/confirm.component';

@Injectable()
export class ConfirmModalFactory {
  constructor(public vcr: ViewContainerRef) {}

  public create(config: IConfirmModalConfig) {
    const ref = this.vcr.createComponent(ConfirmComponent);

    ref.setInput('config', config);
    ref.setInput('cf', ref);

    return ref;
  }
}
