import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { INotifyNoteItemPhoto } from '@notify/interfaces';
import { ToastrService } from 'ngx-toastr';
import { Subject, of, switchMap } from 'rxjs';
import { NoteItemBaseComponent } from '../../../../../constructors/note-item.base.component';
import { NoteService } from '../../../../../services';
import {
  AvatarComponent,
  ImageCropperFactory,
  UploadComponent,
} from '../../../../../standalones';
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
  providers: [NoteService, ImageCropperFactory],
  templateUrl: './note-photo-item.component.html',
  styleUrls: ['../../../notes.styles.scss'],
})
export class NotePhotoItemComponent extends NoteItemBaseComponent {
  private _noteService = inject(NoteService);
  private _toastr = inject(ToastrService);
  private _imageCropperFactory = inject(ImageCropperFactory);

  public formVisible = false;

  public removeFile$ = new Subject<void>();

  public get itemValue() {
    return this.item?.value as INotifyNoteItemPhoto;
  }

  override componentInit(): void {
    this.initForm(
      new FormGroup({
        title: new FormControl(this.itemValue?.title || 'Foto', [
          Validators.required,
        ]),
        url: new FormControl(this.itemValue?.url, [Validators.required]),
      })
    );

    this.formVisible = !this.itemValue?.url;
  }

  override itemDeleted() {
    if (!this.itemValue?.url) {
      return of(true);
    }

    const itemName = this.itemValue.url.split('/').pop() || '';

    return this._noteService.deleteItem(
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
    if (!event.file) {
      this.form.controls['url'].setValue(null, { emitEvent: true });
      return;
    }

    const ref = this._imageCropperFactory.create({
      imageData: event.file as File,
    });

    ref.instance.destroyed$.subscribe(() => {
      this.form.controls['url'].setValue(this.form.value.url);
      this.removeFile$.next();
    });

    return ref.instance.submitted
      .pipe(
        switchMap((e) =>
          this._noteService.uploadFile(
            e,
            this.note?._id || '',
            this.item._id || '',
            event?.file?.name || ''
          )
        )
      )
      .subscribe((response) => {
        this.form.controls['url'].setValue(response.url, { emitEvent: true });
        this.formVisible = false;
      });
  }
}
