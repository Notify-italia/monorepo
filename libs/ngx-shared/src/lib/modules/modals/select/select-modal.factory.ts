import { Injectable } from '@angular/core';
import { BaseFactory } from '../../../constructors';
import { ISelectOption, SelectComponent } from './select.component';

@Injectable()
export class SelectModalFactory extends BaseFactory {
  public create(config: {
    title: string;
    subtitle?: string;
    options: ISelectOption[];
    hideCancel?: boolean;
  }) {
    return this._createComponent(SelectComponent, config);
  }
}
