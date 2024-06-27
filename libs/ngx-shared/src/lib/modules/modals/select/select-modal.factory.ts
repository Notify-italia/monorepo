import { Injectable } from '@angular/core';
import { BaseFactory } from '../../../constructors';
import { SelectComponent } from './select.component';

@Injectable()
export class SelectModalFactory extends BaseFactory {
  public create(config: {
    title: string;
    subtitle?: string;
    options: { value: string; label: string }[];
  }) {
    return this._createComponent(SelectComponent, config);
  }
}
