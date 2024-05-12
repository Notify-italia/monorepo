import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NotifyAdvancedProfileItem } from '@notify/interfaces';
import { INotifyAdvancedProfileManifest } from '../modules/advanced-profile/services/advanced-profile-items.service';
import { controlsFromObject } from '../services';

export interface INotifyCustomTableValueBase {
  valueType: string;
  fieldName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformer?: (value: any) => string;
}

@Component({
  template: '',
})
export class AdvancedItemFormBaseComponent<
  T extends NotifyAdvancedProfileItem
> {
  @Input() form!: FormGroup<controlsFromObject<T>>;
  @Input() manifest!: INotifyAdvancedProfileManifest<T>;
}
