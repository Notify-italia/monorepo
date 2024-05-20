import { Component } from '@angular/core';

import { INotifyAPPhotoItem } from '@notify/interfaces';
import {
  AdvancedItemFormBaseImports,
  AdvancedItemFormBaseProviders,
  AdvancedProfileItemFormBaseComponent,
} from '../../../../constructors/ap-item.form.base.component';
import { TAILWIND_DROPZONE_DEFAULT_LABELS } from '../../../tailwind-forms/components/tailwind-dropzone/tailwind-dropzone.component';

@Component({
  standalone: true,
  imports: AdvancedItemFormBaseImports,
  providers: AdvancedItemFormBaseProviders,
  styleUrls: ['../../advanced-profile.styles.scss'],
  template: ` <div class="flex flex-col space-y-1">
    <notify-upload
      [file]="context.controls.upload.fileData"
      acceptedFiles="image/*"
      uploadLabel="Trascina un'immagine o clicca per caricarla"
      class="h-48"
      (fileChanged)="context.controls.upload.setControlValue($event, 'imgSrc')"
    ></notify-upload>

    <notify-tailwind-checkbox
      [parent]="form"
      name="showCompanyOnClick"
      label="Mostra azienda al tap"
    ></notify-tailwind-checkbox>
  </div>`,
})
export class PhotoFormComponent extends AdvancedProfileItemFormBaseComponent<INotifyAPPhotoItem> {
  public dropzoneLabels = {
    ...TAILWIND_DROPZONE_DEFAULT_LABELS,
    defaultMessage: "Carica un'immagine da visualizzare sul profilo",
  };

  public override async componentReady() {
    this.context.controls.upload.init('imgSrc');
  }
}
