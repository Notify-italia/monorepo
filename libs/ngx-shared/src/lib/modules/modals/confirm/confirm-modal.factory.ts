import { Injectable } from '@angular/core';
import { BaseFactory } from '../../../constructors';
import { ConfirmComponent, IConfirmModalConfig } from './confirm.component';

@Injectable()
export class ConfirmModalFactory extends BaseFactory {
  public get deleteBtn() {
    return `btn btn-error !text-white w-28`;
  }

  public create(config: IConfirmModalConfig) {
    return this._createComponent(ConfirmComponent, {
      config,
    });
  }
}
