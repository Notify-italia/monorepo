import { Injectable } from '@angular/core';
import { BaseFactory } from '../../../constructors';
import { ConfirmComponent, IConfirmModalConfig } from './confirm.component';

@Injectable()
export class ConfirmModalFactory extends BaseFactory {
  public create(config: IConfirmModalConfig) {
    return this._createComponent(ConfirmComponent, {
      config,
    });
  }
}
