import { Component } from '@angular/core';

import { INotifyAPPlaceItem } from '@notify/interfaces';
import {
  AdvancedItemFormBaseComponent,
  AdvancedItemFormBaseImports,
  AdvancedItemFormBaseProviders,
} from '../../../../constructors/ap-item.form.base.component';

@Component({
  standalone: true,
  imports: AdvancedItemFormBaseImports,
  providers: AdvancedItemFormBaseProviders,
  styleUrls: ['../../advanced-profile.styles.scss'],
  template: `
    <div class="flex flex-col space-y-4">
      <div class="flex space-x-2">
        <notify-tailwind-input
          [parent]="form"
          name="address"
          placeholder="Tirreno"
          label="Indirizzo"
          [showClearInput]="false"
          class="w-[70%]"
          [compact]="true"
        ></notify-tailwind-input>
        <notify-tailwind-input
          [parent]="form"
          name="civicNumber"
          placeholder="20"
          label="‎"
          prefix="N. "
          [maxLength]="5"
          class="w-[30%]"
          [compact]="true"
          [showClearInput]="false"
        ></notify-tailwind-input>
      </div>
      <notify-tailwind-input
        [parent]="form"
        name="city"
        placeholder="Prato"
        label="Città"
        [compact]="true"
        [showClearInput]="false"
      ></notify-tailwind-input>

      <div class="divider"></div>

      <notify-tailwind-checkbox
        [parent]="form"
        name="showStreetName"
        label="Indirizzo visible nel profilo"
      ></notify-tailwind-checkbox>
    </div>
  `,
})
export class PlaceFormComponent extends AdvancedItemFormBaseComponent<INotifyAPPlaceItem> {}
