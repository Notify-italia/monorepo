import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { INotifyNoteItemPhoto } from '@notify/interfaces';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { NoteItemBaseComponent } from '../../../../../constructors/note-item.base.component';
import { NoteService } from '../../../../../services';
import { AvatarComponent, UploadComponent } from '../../../../../standalones';
import { TailwindFormsModule } from '../../../../tailwind-forms/tailwind-forms.module';

@Component({
  selector: 'notify-note-photo-item',
  standalone: true,
  imports: [
    CommonModule,
    TailwindFormsModule,
    ReactiveFormsModule,
    UploadComponent,
    AvatarComponent,
  ],
  providers: [NoteService],
  templateUrl: './note-photo-item.component.html',
  styleUrls: ['../../../notes.styles.scss'],
})
export class NotePhotoItemComponent extends NoteItemBaseComponent {
  private _noteService = inject(NoteService);
  private _toastr = inject(ToastrService);

  public formVisible = false;

  public get itemValue() {
    return this.item?.value as INotifyNoteItemPhoto;
  }

  override componentInit(): void {
    this.initForm(
      new FormGroup({
        url: new FormControl(this.itemValue?.url, [Validators.required]),
        comments: new FormArray(
          this.itemValue?.comments?.map(
            (c) =>
              new FormGroup({
                text: new FormControl(c.text),
                createdAt: new FormControl(c.createdAt || new Date()),
                user: new FormControl(c.user._id),
              })
          ) || []
        ),
      })
    );

    this.formVisible = !this.itemValue?.url;
  }

  override itemDeleted() {
    if (!this.itemValue.url) {
      return of(true);
    }

    const itemName = this.itemValue.url.split('/').pop() || '';

    return this._noteService.deleteFile(
      this.note._id,
      this.item._id || '',
      itemName
    );
  }

  public copyUrlToClipboard() {
    const url = this.form.controls['url'].value;
    navigator.clipboard.writeText(url);
    this._toastr.info('URL Copiato');
  }

  public async handleFileUpload(event: {
    file: File | null;
    blob: string | ArrayBuffer | null;
  }) {
    this._noteService
      .uploadFile(
        event.blob,
        this.note?._id || '',
        this.item._id || '',
        event?.file?.name || ''
      )
      .subscribe((response) => {
        this.form.controls['url'].setValue(response.url, { emitEvent: true });
        this.formVisible = false;
      });
  }
}
