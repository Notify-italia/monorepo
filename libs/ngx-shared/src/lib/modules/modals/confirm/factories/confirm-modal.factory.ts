import { Injectable } from '@angular/core';
import { BaseFactory } from '../../../../constructors/base.factory';
import {
  ConfirmComponent,
  IConfirmModalConfig,
} from '../components/confirm/confirm.component';

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
