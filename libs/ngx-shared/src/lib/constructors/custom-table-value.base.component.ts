import { Component, Input, inject } from '@angular/core';
import { UnknownType } from '@notify/interfaces';
import { UtilsService } from '../services';

export interface INotifyCustomTableValueBase {
  valueType: string;
  fieldName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformer?: (value: any) => string;
}

@Component({
  template: '',
})
export class CustomTableValueBaseComponent {
  public _utils = inject(UtilsService);

  @Input({ required: true }) value!: INotifyCustomTableValueBase;
  @Input({ required: true }) iterate!: UnknownType;

  public get iterateValue(): string {
    if (!this.value.fieldName) {
      return '';
    }
    return this._applyTransformer(
      this._utils.deepSearchKey(this.iterate, this.value.fieldName)[0]
    );
  }

  private _applyTransformer(value: unknown): string {
    if (!this.value.transformer) {
      return value as string;
    }
    return this.value.transformer(value);
  }
}
