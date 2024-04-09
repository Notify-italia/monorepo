import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  CustomTableValueBaseComponent,
  INotifyCustomTableValueBase,
} from '../../../../constructors/custom-table-value.base.component';
import { UtilsService } from '../../../../services';

export interface ICTFieldvalue extends INotifyCustomTableValueBase {
  valueType: 'field';
}

@Component({
  selector: 'notify-custom-table-field-value',
  standalone: true,
  imports: [CommonModule],
  providers: [UtilsService],
  template: ` <p>
    {{ iterateValue }}
  </p>`,
})
export class CustomTableFieldValueComponent extends CustomTableValueBaseComponent {
  override value!: ICTFieldvalue;
}
