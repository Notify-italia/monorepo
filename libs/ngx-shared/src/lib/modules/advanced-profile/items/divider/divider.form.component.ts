import { Component } from '@angular/core';

import { INotifyAPDividerItem } from '@notify/interfaces';
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
  template: ` <div class="flex flex-col space-y-4">
    <notify-tailwind-select
      [parent]="form"
      name="style"
      label="Stile divisore"
      [compact]="true"
      [options]="context.components.select.borderStyles"
    ></notify-tailwind-select>
    <notify-tailwind-slider
      [parent]="form"
      name="height"
      label="Altezza blocco"
      [compact]="true"
      [steps]="20"
      [min]="1"
      [max]="50"
      [stepsLabels]="{
        showCurrentStepWhileDragging: true,
      }"
    ></notify-tailwind-slider>
    <notify-tailwind-color-picker
      [parent]="form"
      name="color"
      label="Colore"
      [compact]="true"
    ></notify-tailwind-color-picker>
  </div>`,
})
export class DividerFormComponent extends AdvancedProfileItemFormBaseComponent<INotifyAPDividerItem> {
  public override componentReady(): void {}
}
