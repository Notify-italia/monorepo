import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { INotifyProfile } from '@notify/interfaces';
import { tap } from 'rxjs';
import { ProfileService } from '../../../../services';
import { UploadComponent } from '../../../../standalones';

@Component({
  selector: 'notify-background-image-form',
  standalone: true,
  imports: [CommonModule, UploadComponent],
  providers: [ProfileService],
  template: ` <notify-upload
    [file]="fileData"
    acceptedFiles="image/*"
    uploadLabel="Trascina un'immagine o clicca per caricarla"
    class="h-48"
    (fileChanged)="setFileControlValue($event)"
  ></notify-upload>`,
})
export class AdvancedProfileBackgroundImageFormComponent implements OnInit {
  private _profile = inject(ProfileService);

  @Input({ required: true }) pageSettingsForm!: FormGroup;
  @Input({ required: true }) profile!: INotifyProfile;

  public fileData: File | null = null;

  public ngOnInit(): void {
    this._initFileData();
  }

  public setFileControlValue(event: {
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

    this._uploadFile(event, profileId, itemId).subscribe();
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

  private _uploadFile(
    event: {
      file: File | null;
      blob: string | ArrayBuffer | null;
    },
    profileId: string,
    itemId: string
  ) {
    return this._profile
      .uploadFile(
        {
          blob: event.blob,
          name: event.file?.name || 'file',
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
