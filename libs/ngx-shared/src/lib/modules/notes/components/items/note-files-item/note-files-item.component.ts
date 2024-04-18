import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { INotifyNoteItemFiles } from '@notify/interfaces';
import { NoteItemBaseComponent } from '../../../../../constructors/note-item.base.component';
import {
  AuthService,
  NoteService,
  UtilsService,
} from '../../../../../services';
import { UploadComponent } from '../../../../../standalones';
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

  constructor() {
    super();
  }

  public get itemValue() {
    return this.item.value as INotifyNoteItemFiles;
  }

  public get files(): FormArray {
    return this.form.get('files') as FormArray;
  }

  public get cdnPostEndpoint(): string {
    return `${this._utilsService.apiUrl}/${this._noteService.uploadFileEndpoint}`;
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
