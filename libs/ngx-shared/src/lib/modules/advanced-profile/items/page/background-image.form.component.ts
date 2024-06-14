import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { INotifyProfile } from '@notify/interfaces';
import Compressor from 'compressorjs';
import { tap } from 'rxjs';
import { ProfileService, UtilsService } from '../../../../services';
import { UploadComponent } from '../../../../standalones';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';

@Component({
  selector: 'notify-background-image-form',
  standalone: true,
  imports: [CommonModule, UploadComponent, TailwindFormsModule],
  providers: [ProfileService, UtilsService],
  template: `
    <div class="flex flex-col space-y-4">
      <notify-upload
        [file]="fileData"
        acceptedFiles="image/*"
        uploadLabel="Trascina un'immagine o clicca per caricarla"
        class="h-48"
        (fileChanged)="setFileControlValue($event)"
      ></notify-upload>

      <notify-tailwind-slider
        [parent]="pageSettingsForm"
        name="backgroundBlur"
        label="Sfocatura"
        [min]="0"
        [max]="20"
        [steps]="10"
        [compact]="true"
        [stepsLabels]="{
          showCurrentStepWhileDragging: true,
          stepUsesPercentage: true,
          stepSuffix: '%',
          startLabel: '0%',
          endLabel: '100%'
        }"
      ></notify-tailwind-slider>

      <notify-tailwind-slider
        [parent]="pageSettingsForm"
        name="backgroundBrightness"
        label="Luminosità"
        [min]="0"
        [max]="100"
        [steps]="10"
        [compact]="true"
        [stepsLabels]="{
          showCurrentStepWhileDragging: true,
          stepUsesPercentage: true,
          stepSuffix: '%',
          startLabel: '0%',
          endLabel: '100%',
          
        }"
      ></notify-tailwind-slider>
    </div>
  `,
})
export class AdvancedProfileBackgroundImageFormComponent implements OnInit {
  private _profile = inject(ProfileService);
  private _utilsService = inject(UtilsService);

  @Input({ required: true }) pageSettingsForm!: FormGroup;
  @Input({ required: true }) profile!: INotifyProfile;

  public fileData: File | null = null;

  public ngOnInit(): void {
    this._initFileData();
  }

  public async setFileControlValue(event: {
    file: File | null;
    blob: string | ArrayBuffer | null;
  }) {
    const profileId = this.profile._id;
    const itemId = 'background';

    const formControl = this.pageSettingsForm.controls['imgSrc'];

    if (!event.file) {
      this.fileData = null;
      const fileName = this._fileNameFormUrl(formControl.value);
      formControl.setValue(null);
      this._profile.deleteFile(profileId, itemId, fileName).subscribe();

      return;
    }

    const compressed = await this._compressImage(event.file);

    console.log('compressed', compressed);

    (await this._uploadFile(compressed, profileId, itemId)).subscribe();
  }

  private async _initFileData() {
    const formControl = this.pageSettingsForm.controls['imgSrc'];
    const result = await fetch(formControl?.value || '')
      .then((res) => res.blob()) // Gets the response and returns it as a blob
      .then((blob) => {
        if (!blob || blob.type === 'text/html') {
          return null;
        }

        return this._generateFile(
          blob,
          this._fileNameFormUrl(formControl?.value || '') || 'image.jpg',
          blob.type
        );
      });

    this.fileData = result;
  }

  private async _refreshFileData() {
    const formControl = this.pageSettingsForm.controls['imgSrc'];
    const result = await fetch(formControl?.value || '')
      .then((res) => res.blob()) // Gets the response and returns it as a blob
      .then((blob) => {
        if (!blob || blob.type === 'text/html') {
          return null;
        }

        return this._generateFile(
          blob,
          this._fileNameFormUrl(formControl?.value || '') || 'image.jpg',

          blob.type
        );
      });
    this.fileData = result;
  }

  private async _compressImage(imgBlob: File | Blob) {
    const result = new Promise<File>((resolve) => {
      new Compressor(imgBlob, {
        quality: 0.4,
        mimeType: 'image/webp',
        success: (result) => {
          return resolve(result as File);
        },
        error: (err) => {
          console.log(err.message);
        },
      });
    });

    return result;
  }

  private _generateFile(
    blob: BlobPart,
    name: string,
    type: string
  ): File | null {
    return new File([blob], name, { type });
  }

  private _fileNameFormUrl(url: string) {
    return url.split('/').pop()?.split('?')[0] || 'file';
  }

  private async _uploadFile(event: File, profileId: string, itemId: string) {
    const base64 = await event?.arrayBuffer();

    return this._profile
      .uploadFile(
        {
          blob: await this._utilsService.arrayBufferToBase64(
            base64 as ArrayBuffer
          ),
          name: (event?.name || 'file').replace(/[^a-zA-Z0-9]/g, '_'),
        },
        profileId,
        itemId
      )
      .pipe(
        tap((r) => {
          this.pageSettingsForm.controls['imgSrc']?.setValue(r.url);
          this._refreshFileData();
        })
      );
  }
}
