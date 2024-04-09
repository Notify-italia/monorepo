import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  CustomTableValueBaseComponent,
  INotifyCustomTableValueBase,
} from '../../../../constructors/custom-table-value.base.component';

export interface ICTFieldvalue extends INotifyCustomTableValueBase {
  valueType: 'field';
}

@Component({
  selector: 'notify-custom-table-field-value',
  standalone: true,
  imports: [CommonModule],
  template: ` <p>
    {{ iterateValue }}
  </p>`,
})
export class CustomTableFieldValueComponent extends CustomTableValueBaseComponent {
  override value!: ICTFieldvalue;
}
