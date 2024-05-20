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
      [file]="fileData"
      acceptedFiles="image/*"
      uploadLabel="Trascina un'immagine o clicca per caricarla"
      class="h-48"
      (fileChanged)="setFileData($event)"
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

  public fileData: File | null = null;

  private get fileName() {
    const fileUrl = this.form.get('imgSrc')?.value || '';

    return fileUrl.split('/').pop()?.split('?')[0] || 'file';
  }

  public override async componentReady() {
    this.fileData = await fetch(this.form.get('imgSrc')?.value || '')
      .then((res) => res.blob()) // Gets the response and returns it as a blob
      .then((blob) => {
        console.log(blob);
        if (!blob || blob.type === 'text/html') {
          return null;
        }

        return new File([blob], this.fileName, {
          type: blob.type,
        });
      });
  }

  public setFileData(event: {
    file: File | null;
    blob: string | ArrayBuffer | null;
  }) {
    const profileId = this.context.getters.profile._id;
    const itemId = this.context.getters.currentItem._id || '';

    if (!event.file) {
      this.fileData = null;
      this.form.get('imgSrc')?.setValue('');
      this.context.services.profile
        .deleteFile(profileId, itemId, this.fileName)
        .subscribe();

      return;
    }

    this.context.services.profile
      .uploadFile(
        {
          blob: event.blob,
          name: event.file.name,
        },
        profileId,
        itemId
      )
      .subscribe((r) => {
        this.fileData = event.file;
        this.form.get('imgSrc')?.setValue(r.url);
      });
  }
}
