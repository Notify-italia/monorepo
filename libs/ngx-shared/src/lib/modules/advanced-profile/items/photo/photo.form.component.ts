import { Component } from '@angular/core';

import { INotifyAPPhotoItem } from '@notify/interfaces';
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
  template: ` <div class="flex flex-col space-y-4 smooth">
    <notify-upload
      [file]="context.components.upload.fileData"
      acceptedFiles="image/*"
      uploadLabel="Trascina un'immagine o clicca per caricarla"
      class="h-48"
      (fileChanged)="
        context.components.upload.setControlValue($event, 'imgSrc')
      "
    ></notify-upload>

    <notify-tailwind-slider
      [parent]="form"
      name="dimension"
      label="Dimensione"
      [steps]="15"
      [min]="10"
      [max]="100"
      [compact]="true"
      [stepsLabels]="{
        startLabel: '10%',
        endLabel: '100%',
        showCurrentStepWhileDragging: true,
        draggingSuffix: '%',
      }"
    ></notify-tailwind-slider>

    <notify-tailwind-select
      [parent]="form"
      name="align"
      [compact]="true"
      label="Allineamento"
      [options]="context.components.select.align"
    ></notify-tailwind-select>

    <div class="divider"></div>

    <notify-tailwind-checkbox
      [parent]="form"
      name="showCompanyOnClick"
      label="Mostra azienda al tap"
    ></notify-tailwind-checkbox>
  </div>`,
})
export class PhotoFormComponent extends AdvancedProfileItemFormBaseComponent<INotifyAPPhotoItem> {
  public override async componentReady() {
    this.context.components.upload.init('imgSrc');
  }
}
