import { Component, Input } from '@angular/core';

export interface INotifyCustomTableValueBase {
  valueType: string;
  fieldName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformer?: (value: any) => string;
}

@Component({
  standalone: true,
  template: '',
})
export class CustomTableValueBaseComponent {
  @Input({ required: true }) value!: INotifyCustomTableValueBase;
  @Input({ required: true }) iterate!: Record<string, unknown>;

  public get iterateValue(): string {
    if (!this.value.fieldName) {
      return '';
    }
    return this._applyTransformer(this.iterate[this.value.fieldName]);
  }

  private _applyTransformer(value: unknown): string {
    if (!this.value.transformer) {
      return value as string;
    }
    return this.value.transformer(value);
  }
}
