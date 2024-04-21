import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { INotifyNoteItemFiles } from '@notify/interfaces';
import { delay, firstValueFrom, of, switchMap } from 'rxjs';
import { NoteItemBaseComponent } from '../../../../../constructors/note-item.base.component';
import {
  AuthService,
  NoteService,
  UtilsService,
} from '../../../../../services';
import { UploadComponent } from '../../../../../standalones';
import { INotifyTailwindDropzoneCdnConfig } from '../../../../tailwind-forms/components/tailwind-dropzone/tailwind-dropzone.component';
import { TailwindFormsModule } from '../../../../tailwind-forms/tailwind-forms.module';

@Component({
  selector: 'notify-note-files-item',
  standalone: true,
  imports: [
    CommonModule,
    TailwindFormsModule,
    ReactiveFormsModule,
    UploadComponent,
  ],
  providers: [NoteService],
  templateUrl: './note-files-item.component.html',
  styleUrls: ['./note-files-item.component.scss', '../../../notes.styles.scss'],
})
export class NoteFilesItemComponent extends NoteItemBaseComponent {
  public _noteService = inject(NoteService);
  public authService = inject(AuthService);
  private _utilsService = inject(UtilsService);

  public cdnConfig!: INotifyTailwindDropzoneCdnConfig;

  constructor() {
    super();
  }

  override componentReady(): void {
    this.cdnConfig = {
      postEndpoint: this.cdnEndpoint,
      authorization: this.authService.authHeaders,
      body: { item: this.item._id || '', note: this.note._id || '' },
      deleteEndpoint: this.cdnEndpoint,
      deleteSchema: {
        name: 'name',
      },
      deleteExtraParams: {
        item: this.item._id || '',
        note: this.note._id || '',
      },
      responseSchema: {
        value: 'url',
      },
    };
  }

  override itemDeleted() {
    this._utilsService.asyncForEach(
      this.itemValue.files,
      async (file, index) => {
        await firstValueFrom(
          of(file).pipe(
            delay(index * 50),
            switchMap((file) =>
              this._noteService.deleteItem(
                this.note._id,
                this.item._id || '',
                file.name
              )
            )
          )
        );
      }
    );

    return of();
  }

  public get itemValue() {
    return this.item.value as INotifyNoteItemFiles;
  }

  public get files(): FormArray {
    return this.form.get('files') as FormArray;
  }

  public get cdnEndpoint(): string {
    return `${this._utilsService.apiUrl}${this._noteService.uploadFileEndpoint}`;
  }

  override componentInit(): void {
    this.initForm(
      new FormGroup({
        title: new FormControl(this.itemValue?.title ?? 'Collezione di files'),
        files: new FormControl(this.itemValue?.files || []),
      })
    );
  }
}
