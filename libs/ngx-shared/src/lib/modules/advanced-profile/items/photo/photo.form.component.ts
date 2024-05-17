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
    <notify-tailwind-dropzone
      [parent]="form"
      acceptedFiles="image/*"
      name="imgSrc"
      [maxFiles]="1"
      height="10rem"
      [labels]="dropzoneLabels"
      [cdnConfig]="cdnConfig"
      [centerPreview]="true"
    ></notify-tailwind-dropzone>
  </div>`,
})
export class PhotoFormComponent extends AdvancedProfileItemFormBaseComponent<INotifyAPPhotoItem> {
  public dropzoneLabels = {
    ...TAILWIND_DROPZONE_DEFAULT_LABELS,
    defaultMessage: "Carica un'immagine da visualizzare sul profilo",
  };
}
