import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  CustomTableValueBaseComponent,
  INotifyCustomTableValueBase,
} from '../../../../constructors/custom-table-value.base.component';

export interface ICTBadgevalue extends INotifyCustomTableValueBase {
  valueType: 'badge';
  style: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    condition: (iterate: any) => boolean;
    bg: string;
    text: string;
  }[];
}

@Component({
  standalone: true,
  selector: 'notify-custom-table-badge-value',
  template: ` <span
    class="flex whitespace-nowrap py-1 px-2 rounded-full w-fit text-white text-xs min-w-24 justify-center"
    [style.backgroundColor]="currentStyle.bg"
    [style.color]="currentStyle.text"
  >
    {{ iterateValue }}
  </span>`,
  imports: [CommonModule],
})
export class CustomTableBadgeValueComponent extends CustomTableValueBaseComponent {
  override value!: ICTBadgevalue;

  public get currentStyle(): {
    condition: string;
    bg: string;
    text: string;
  } {
    const currentStyle = this.value.style.find((style) =>
      style.condition(this.iterate)
    );
    return {
      condition: currentStyle?.condition.toString() ?? '',
      bg: currentStyle?.bg ?? 'gray',
      text: currentStyle?.text ?? 'white',
    };
  }
}
