import { Component } from '@angular/core';

import { INotifyAPPlaceItem } from '@notify/interfaces';
import {
  AdvancedItemFormBaseImports,
  AdvancedItemFormBaseProviders,
  AdvancedProfileItemFormBaseComponent,
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
      <notify-tailwind-input
        [parent]="form"
        name="companyName"
        placeholder="Offcenter SRL"
        label="Nome Attività"
        [compact]="true"
        [showClearInput]="false"
        helpText="Solo per uso interno, non visibile nel profilo"
      ></notify-tailwind-input>

      <div class="divider"></div>

      <notify-tailwind-slider
        [parent]="form"
        name="zoom"
        label="Zoom"
        [min]="1"
        [max]="20"
        [steps]="20"
        [compact]="true"
        [stepsLabels]="{
          startLabel: 'Satellite',
          endLabel: 'Strada',
          showCurrentStepWhileDragging: true,
          draggingUsesPercentage: true,
          draggingSuffix: 'x',
        }"
      ></notify-tailwind-slider>

      <notify-tailwind-checkbox
        [parent]="form"
        name="showStreetName"
        label="Indirizzo visible nel profilo"
      ></notify-tailwind-checkbox>
    </div>
  `,
})
export class PlaceFormComponent extends AdvancedProfileItemFormBaseComponent<INotifyAPPlaceItem> {}
