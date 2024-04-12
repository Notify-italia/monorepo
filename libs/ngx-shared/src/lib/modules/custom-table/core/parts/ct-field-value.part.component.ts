import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  CustomTableValueBaseComponent,
  INotifyCustomTableValueBase,
} from '../../../../constructors/custom-table-value.base.component';
import { UtilsService } from '../../../../services';

export interface ICTFieldValue extends INotifyCustomTableValueBase {
  valueType: 'field';
  skeletonLength: number;
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
  override value!: ICTFieldValue;
}
