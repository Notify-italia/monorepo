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
        stepSuffix: '%',
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
      [compact]="true"
      name="showCompanyOnClick"
      label="Mostra profilo aziendale al tap"
    ></notify-tailwind-checkbox>

    <notify-tailwind-input
      [ngClass]="{
        '-translate-y-5 opacity-0 h-0': form.value.showCompanyOnClick
      }"
      class="smooth"
      [parent]="form"
      name="redirectUrl"
      label="Reindirizza ad un URL al tap"
      [compact]="true"
      [titlecaseLabel]="false"
      placeholder="Inserisci un URL"
      prefix="https://"
      helpText="Lascia vuoto per non reindirizzare"
    ></notify-tailwind-input>
  </div>`,
})
export class PhotoFormComponent extends AdvancedProfileItemFormBaseComponent<INotifyAPPhotoItem> {
  public override async componentReady() {
    this.context.components.upload.init('imgSrc');
  }
}
